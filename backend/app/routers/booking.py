from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import date

from app.database import get_db
from app.models.booking import Booking
from app.models.salon import Salon
from app.models.user import User

from app.schemas.booking import BookingCreate, BookingResponse, BookingStatusUpdate, AvailableSlotsResponse
from app.utils.auth import get_current_user
from app.utils.permissions import require_owner
from app.services.booking_service import AppBookingService

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
    return AppBookingService.get_available_slots(db, salon_id, target_date, service_id)

# 1. User Membuat Booking Baru
@router.post("/", response_model=BookingResponse, status_code=status.HTTP_201_CREATED)
def create_booking(
    booking_in: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppBookingService.create_booking(db, booking_in, current_user)

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
    current_user: User = Depends(require_owner)
):
    return AppBookingService.update_owner_status(db, booking_id, status_update.status, current_user)

# 3b. User Memperbarui Status Booking Miliknya
@router.put("/{booking_id}/user-status", response_model=BookingResponse)
def update_booking_status_by_user(
    booking_id: int,
    status_update: BookingStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppBookingService.update_user_status(db, booking_id, status_update.status, current_user)

# 4. Owner/Admin Melihat Semua Booking di Salonnya
@router.get("/salons/{salon_id}", response_model=List[BookingResponse])
def get_owner_bookings(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
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
    AppBookingService.delete_booking(db, booking_id, current_user)
    return