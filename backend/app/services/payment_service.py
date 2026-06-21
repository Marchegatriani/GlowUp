from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.payment import Payment
from app.models.booking import Booking
from app.models.user import User

class AppPaymentService:
    @staticmethod
    def set_payment_method(db: Session, booking_id: int, method: str, current_user: User):
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
        
        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Akses ditolak")

        valid_methods = ["cash", "transfer", "ewallet"]
        if method not in valid_methods:
            raise HTTPException(status_code=400, detail="Metode pembayaran tidak valid")

        payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment record tidak ditemukan")

        payment.method = method
        db.commit()
        db.refresh(payment)
        return payment

    @staticmethod
    def get_payment_detail(db: Session, booking_id: int, current_user: User):
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

        if booking.user_id != current_user.id and current_user.role not in ["owner", "admin"]:
            raise HTTPException(status_code=403, detail="Akses ditolak")
            
        payment = db.query(Payment).filter(Payment.booking_id == booking_id).first()
        return payment

    @staticmethod
    def update_payment_status(db: Session, payment_id: int, status: str, current_user: User):
        payment = db.query(Payment).filter(Payment.id == payment_id).first()
        if not payment:
            raise HTTPException(status_code=404, detail="Payment tidak ditemukan")

        payment.status = status
        
        if payment.status == "paid":
            payment.booking.status = "confirmed"

        db.commit()
        db.refresh(payment)
        return payment
