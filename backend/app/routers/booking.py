from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime, timedelta

from app.database import SessionLocal
from app.models.booking import Booking, BookingService
from app.models.salon import Salon
from app.models.service import SalonService
from app.models.user import User
from app.models.payment import Payment

from app.schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate
from app.utils.auth import get_current_user
from app.utils.permissions import require_owner

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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
        valid_services.append(salon_service)

    if not valid_services:
        raise HTTPException(status_code=400, detail="Minimal pilih satu layanan untuk di-booking")

    # 3. Insert ke tabel bookings
    new_booking = Booking(
        user_id=current_user.id,
        salon_id=booking_in.salon_id,
        booking_time=booking_in.booking_time,
        total_price=total_price,
        status="pending"
    )
    db.add(new_booking)
    db.flush() # Mirip commit, tapi menyimpannya ke memori sementara untuk mendapatkan ID new_booking

    # 4. Insert ke tabel booking_services
    for srv in valid_services:
        booking_service = BookingService(
            booking_id=new_booking.id,
            salon_service_id=srv.id,
            price=srv.price # Kunci harga saat ini
        )
        db.add(booking_service)
    
    db.commit() # Simpan semuanya ke database permanen
    db.refresh(new_booking)

    # 5. Otomatis buat Payment (Status = Pending)
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