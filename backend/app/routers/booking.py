from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta, date, time

from app.database import get_db
from app.models.booking import Booking, BookingService
from app.models.salon import Salon
from app.models.service import SalonService
from app.models.user import User
from app.models.payment import Payment

from app.schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate, AvailableSlotsResponse
from app.utils.auth import get_current_user
from app.utils.permissions import require_owner

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

# 0. Dapatkan Jadwal Kosong (Available Slots)
@router.get("/available-slots", response_model=AvailableSlotsResponse)
def get_available_slots(
    salon_id: int,
    target_date: date,
    service_id: int,
    db: Session = Depends(get_db)
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    service = db.query(SalonService).filter(SalonService.id == service_id, SalonService.salon_id == salon_id).first()
    if not service:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan di salon ini")

    duration = service.duration_minutes

    # Get existing bookings for this salon on this date
    # Start of day to end of day
    start_of_day = datetime.combine(target_date, time.min)
    end_of_day = datetime.combine(target_date, time.max)
    
    existing_bookings = db.query(Booking).filter(
        Booking.salon_id == salon_id,
        Booking.booking_time >= start_of_day,
        Booking.booking_time <= end_of_day,
        Booking.status.in_(["pending", "confirmed"])
    ).all()

    slots = []
    # Generate slots from open_time
    # open_time is datetime.time
    current_time = datetime.combine(target_date, salon.open_time)
    close_time_dt = datetime.combine(target_date, salon.close_time)

    # Current time (now) to prevent booking past slots today
    now = datetime.now()

    while True:
        slot_end_time = current_time + timedelta(minutes=duration)
        if slot_end_time > close_time_dt:
            break
            
        # Default to available
        is_available = True
        
        # If the date is today, check if the slot is in the past
        if current_time < now:
            is_available = False
        else:
            # Check overlap with existing bookings
            for b in existing_bookings:
                b_start = b.booking_time
                b_end = b.end_time if b.end_time else b_start + timedelta(minutes=duration) # fallback
                
                # Overlap condition: max(start1, start2) < min(end1, end2)
                overlap_start = max(current_time, b_start)
                overlap_end = min(slot_end_time, b_end)
                
                if overlap_start < overlap_end:
                    is_available = False
                    break

        slots.append({
            "time": current_time.strftime("%H:%M"),
            "available": is_available
        })
        
        # Increment by duration
        current_time = slot_end_time

    return {"slots": slots}

# 1. User Membuat Booking Baru
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # Memastikan user sudah login
):
    # 1. Validasi apakah salon tersebut ada
    salon = db.query(Salon).filter(Salon.id == booking_in.salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    # 1a. Validasi apakah waktu booking sesuai dengan jam operasional salon
    booking_time_only = booking_in.booking_time.time()
    if booking_time_only < salon.open_time or booking_time_only > salon.close_time:
        raise HTTPException(
            status_code=400, 
            detail=f"Waktu booking di luar jam operasional salon ({salon.open_time.strftime('%H:%M')} - {salon.close_time.strftime('%H:%M')})"
        )

    # 1b. Mencegah Bentrok Jadwal (Double Booking)
    # Cek apakah ada booking di salon yang sama, pada jam tersebut, yang belum dibatalkan/selesai
    existing_booking = db.query(Booking).filter(
        Booking.salon_id == booking_in.salon_id,
        Booking.booking_time == booking_in.booking_time,
        Booking.status.in_(["pending", "confirmed"])
    ).first()

    if existing_booking:
        raise HTTPException(status_code=400, detail="Jadwal pada jam tersebut sudah di-booking oleh orang lain. Silakan pilih waktu lain.")

    total_price = 0
    total_duration_minutes = 0
    valid_services = []

    # 2. Loop list layanan yang dikirim oleh user, cek dan hitung harganya
    for s_id in booking_in.service_ids:
        salon_service = db.query(SalonService).filter(
            SalonService.id == s_id,
            SalonService.salon_id == booking_in.salon_id
        ).first()
        
        if not salon_service:
            raise HTTPException(
                status_code=400, 
                detail=f"Layanan dengan ID {s_id} tidak tersedia di salon ini"
            )
        
        total_price += salon_service.price
        total_duration_minutes += salon_service.duration_minutes
        valid_services.append(salon_service)

    if not valid_services:
        raise HTTPException(status_code=400, detail="Minimal pilih satu layanan untuk di-booking")

    # 3. Hitung end_time berdasarkan total durasi
    end_time = booking_in.booking_time + timedelta(minutes=total_duration_minutes)

    # 4. Insert ke tabel bookings
    new_booking = Booking(
        user_id=current_user.id,
        salon_id=booking_in.salon_id,
        booking_time=booking_in.booking_time,
        end_time=end_time,
        total_price=total_price,
        status="pending"
    )
    db.add(new_booking)
    db.flush() # Mirip commit, tapi menyimpannya ke memori sementara untuk mendapatkan ID new_booking

    # 5. Insert ke tabel booking_services
    for srv in valid_services:
        booking_service = BookingService(
            booking_id=new_booking.id,
            salon_service_id=srv.id,
            price=srv.price # Kunci harga saat ini
        )
        db.add(booking_service)
    
    db.commit() # Simpan semuanya ke database permanen
    db.refresh(new_booking)

    # 6. Otomatis buat Payment (Status = Pending)
    new_payment = Payment(
        booking_id=new_booking.id,
        amount=new_booking.total_price,
        status="pending"
    )
    db.add(new_payment)
    db.commit()

    return new_booking

# 2. User Melihat History Booking Miliknya Sendiri
@router.get("/me", response_model=List[BookingResponse])
def get_my_bookings(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return db.query(Booking).filter(Booking.user_id == current_user.id).all()

# 2a. User/Owner/Admin Melihat Detail Booking Spesifik
@router.get("/{booking_id}", response_model=BookingResponse)
def get_booking_by_id(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
    
    # Pastikan user yang login adalah pemilik booking ini, atau owner salon bersangkutan, atau admin
    salon = db.query(Salon).filter(Salon.id == booking.salon_id).first()
    if (
        booking.user_id != current_user.id 
        and (not salon or salon.owner_id != current_user.id) 
        and current_user.role != "admin"
    ):
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    return booking


# 3. Owner/Admin Memperbarui Status Booking
@router.put("/{booking_id}/status", response_model=BookingResponse)
def update_booking_status(
    booking_id: int,
    status_update: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner) # HANYA OWNER/ADMIN
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

    # Pastikan yang mengedit status adalah Owner dari salon tempat booking itu terjadi
    salon = db.query(Salon).filter(Salon.id == booking.salon_id).first()
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Ini bukan booking untuk salon Anda.")

    # Update status
    valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Status tidak valid")

    # Mencegah Owner membatalkan pesanan yang sudah dibayar (confirmed)
    if status_update.status == "cancelled" and booking.status == "confirmed" and current_user.role != "admin":
        raise HTTPException(
            status_code=400, 
            detail="Owner tidak dapat membatalkan booking yang sudah dibayar oleh Customer."
        )

    if status_update.status == "completed" and booking.booking_time > datetime.now():
        raise HTTPException(
            status_code=400, 
            detail="Booking belum bisa diselesaikan karena tanggal/waktu appointment belum tiba."
        )

    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking

# 3b. User Memperbarui Status Booking Miliknya
@router.put("/{booking_id}/user-status", response_model=BookingResponse)
def update_booking_status_by_user(
    booking_id: int,
    status_update: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak. Ini bukan booking Anda.")

    valid_statuses = ["completed", "cancelled"]
    if status_update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail="Status tidak valid. User hanya dapat menyelesaikan atau membatalkan pesanan.")

    if status_update.status == "completed" and booking.booking_time > datetime.now():
        raise HTTPException(
            status_code=400, 
            detail="Booking belum bisa diselesaikan karena waktu appointment belum tiba."
        )

    booking.status = status_update.status
    db.commit()
    db.refresh(booking)
    return booking

# 4. Owner/Admin Melihat Semua Booking di Salonnya
@router.get("/salons/{salon_id}", response_model=List[BookingResponse])
def get_owner_bookings(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner) # HANYA OWNER/ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
        
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    return db.query(Booking).filter(Booking.salon_id == salon_id).all()

# 5. User/Owner/Admin Membatalkan/Menghapus Booking
@router.delete("/{booking_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
    
    # Pastikan user yang menghapus adalah pemilik booking ini, atau owner salon bersangkutan, atau admin
    salon = db.query(Salon).filter(Salon.id == booking.salon_id).first()
    if (
        booking.user_id != current_user.id 
        and (not salon or salon.owner_id != current_user.id) 
        and current_user.role != "admin"
    ):
        raise HTTPException(status_code=403, detail="Akses ditolak")
    
    # Hapus booking_services terasosiasi
    db.query(BookingService).filter(BookingService.booking_id == booking_id).delete()
    # Hapus payment terasosiasi
    db.query(Payment).filter(Payment.booking_id == booking_id).delete()
    # Hapus booking
    db.delete(booking)
    db.commit()
    return