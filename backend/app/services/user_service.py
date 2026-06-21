from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import User
from app.models.booking import Booking, BookingService
from app.models.review import Review
from app.models.payment import Payment
from app.models.salon import Salon
from app.models.service import SalonService

class UserService:
    @staticmethod
    def delete_user(db: Session, user: User, current_user: User):
        if user.id == current_user.id:
            raise HTTPException(status_code=400, detail="Admin tidak diperbolehkan menghapus akun sendiri")

        if user.role == "owner":
            salons = db.query(Salon).filter(Salon.owner_id == user.id).all()
            for salon in salons:
                bookings = db.query(Booking).filter(Booking.salon_id == salon.id).all()
                for b in bookings:
                    db.query(BookingService).filter(BookingService.booking_id == b.id).delete(synchronize_session=False)
                    db.query(Review).filter(Review.booking_id == b.id).delete(synchronize_session=False)
                    db.query(Payment).filter(Payment.booking_id == b.id).delete(synchronize_session=False)
                    db.delete(b)
                
                db.query(Review).filter(Review.salon_id == salon.id).delete(synchronize_session=False)
                db.query(SalonService).filter(SalonService.salon_id == salon.id).delete(synchronize_session=False)
                db.delete(salon)
        else:
            bookings = db.query(Booking).filter(Booking.user_id == user.id).all()
            for b in bookings:
                db.query(BookingService).filter(BookingService.booking_id == b.id).delete(synchronize_session=False)
                db.query(Review).filter(Review.booking_id == b.id).delete(synchronize_session=False)
                db.query(Payment).filter(Payment.booking_id == b.id).delete(synchronize_session=False)
                db.delete(b)
            
            db.query(Review).filter(Review.user_id == user.id).delete(synchronize_session=False)

        db.delete(user)
        db.commit()
