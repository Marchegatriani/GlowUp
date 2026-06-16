from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User

from app.schemas.payment import PaymentResponse, PaymentMethodInput, PaymentStatusUpdate
from app.utils.auth import get_current_user

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

# 1. Memilih Metode Pembayaran (Sesuai request POST /payments)
@router.post("/", response_model=PaymentResponse)
def set_payment_method(
    payment_in: PaymentMethodInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == payment_in.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
    
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak")

    valid_methods = ["cash", "transfer", "ewallet"]
    if payment_in.method not in valid_methods:
        raise HTTPException(status_code=400, detail="Metode pembayaran tidak valid")

    payment = db.query(Payment).filter(Payment.booking_id == payment_in.booking_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment record tidak ditemukan")

    # Update metode
    payment.method = payment_in.method
    db.commit()
    db.refresh(payment)
    return payment

# 2. Melihat data Payment berdasarkan Booking ID
@router.get("/{booking_id}", response_model=PaymentResponse)
def get_payment_detail(booking_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

    # Hanya pemilik booking dan Owner salon / Admin yang boleh lihat
    if booking.user_id != current_user.id and current_user.role not in ["owner", "admin"]:
        raise HTTPException(status_code=403, detail="Akses ditolak")
        
    payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
    return payment

# 3. Simulasi Bayar (Update Status)
@router.put("/{payment_id}/status", response_model=PaymentResponse)
def update_payment_status(payment_id: int, status_update: PaymentStatusUpdate, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    payment = db.query(Payment).filter(Payment.id == payment_id).first()
    if not payment:
        raise HTTPException(status_code=404, detail="Payment tidak ditemukan")

    payment.status = status_update.status
    
    # TRIGGER OTOMATIS: Jika payment paid, otomatis booking menjadi confirmed
    if payment.status == "paid":
        payment.booking.status = "confirmed"

    db.commit()
    db.refresh(payment)
    return payment