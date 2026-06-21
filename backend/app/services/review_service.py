from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.review import Review
from app.models.booking import Booking
from app.models.salon import Salon
from app.models.user import User
from app.schemas.review import ReviewCreate

class AppReviewService:
    @staticmethod
    def create_review(db: Session, review_in: ReviewCreate, current_user: User):
        booking = db.query(Booking).filter(Booking.id == review_in.booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Akses ditolak. Anda hanya dapat mereview booking Anda sendiri")

        if booking.status not in ["confirmed", "completed"]:
            raise HTTPException(status_code=400, detail="Anda hanya dapat memberikan review untuk layanan yang sudah dikonfirmasi/selesai")

        existing_review = db.query(Review).filter(Review.booking_id == review_in.booking_id).first()
        if existing_review:
            raise HTTPException(status_code=400, detail="Anda sudah memberikan review untuk booking ini")

        new_review = Review(
            user_id=current_user.id,
            salon_id=booking.salon_id,
            booking_id=booking.id,
            rating=review_in.rating,
            comment=review_in.comment
        )
        db.add(new_review)
        db.commit()
        db.refresh(new_review)
        return new_review

    @staticmethod
    def get_salon_reviews(db: Session, salon_id: int):
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
            
        reviews = db.query(Review).filter(Review.salon_id == salon_id).all()
        return reviews

    @staticmethod
    def get_my_reviews(db: Session, current_user: User):
        return db.query(Review).filter(Review.user_id == current_user.id).all()

    @staticmethod
    def update_review(db: Session, review_id: int, rating: int, comment: str, current_user: User):
        review = db.query(Review).filter(Review.id == review_id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Review tidak ditemukan")
            
        if review.user_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Akses ditolak. Anda tidak berhak mengubah review ini.")
            
        review.rating = rating
        review.comment = comment
        db.commit()
        db.refresh(review)
        return review

    @staticmethod
    def delete_review(db: Session, review_id: int, current_user: User):
        review = db.query(Review).filter(Review.id == review_id).first()
        if not review:
            raise HTTPException(status_code=404, detail="Review tidak ditemukan")
            
        if review.user_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Akses ditolak. Anda tidak berhak menghapus review ini.")
            
        db.delete(review)
        db.commit()
        return
