from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.review import Review
from app.models.booking import Booking
from app.models.salon import Salon
from app.models.user import User

from app.schemas.review import ReviewCreate, ReviewResponse
from app.utils.auth import get_current_user

router = APIRouter(tags=["Reviews"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 1. POST /reviews - User membuat review
@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user) # WAJIB LOGIN
):
    # Cek ketersediaan booking
    booking = db.query(Booking).filter(Booking.id == review_in.booking_id).first()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

    # Aturan 1 & 2: Hanya user yang melakukan booking yang boleh review
    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda hanya dapat mereview booking Anda sendiri")

    # Cek apakah booking minimal sudah di-confirm/completed
    if booking.status not in ["confirmed", "completed"]:
        raise HTTPException(status_code=400, detail="Anda hanya dapat memberikan review untuk layanan yang sudah dikonfirmasi/selesai")

    # Cek apakah sudah pernah direview sebelumnya
    existing_review = db.query(Review).filter(Review.booking_id == review_in.booking_id).first()
    if existing_review:
        raise HTTPException(status_code=400, detail="Anda sudah memberikan review untuk booking ini")

    # Simpan review
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

# 2. GET /salons/{salon_id}/reviews - Lihat semua review sebuah salon (Public)
@router.get("/salons/{salon_id}/reviews", response_model=List[ReviewResponse])
def get_salon_reviews(salon_id: int, db: Session = Depends(get_db)):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
        
    reviews = db.query(Review).filter(Review.salon_id == salon_id).all()
    return reviews