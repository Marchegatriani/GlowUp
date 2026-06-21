from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User

from app.schemas.review import ReviewCreate, ReviewResponse, ReviewUpdate
from app.utils.auth import get_current_user
from app.services.review_service import AppReviewService

router = APIRouter(tags=["Reviews"])

@router.post("/reviews", response_model=ReviewResponse, status_code=status.HTTP_201_CREATED)
def create_review(
    review_in: ReviewCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppReviewService.create_review(db, review_in, current_user)

@router.get("/salons/{salon_id}/reviews", response_model=List[ReviewResponse])
def get_salon_reviews(salon_id: int, db: Session = Depends(get_db)):
    return AppReviewService.get_salon_reviews(db, salon_id)

@router.get("/reviews/me", response_model=List[ReviewResponse])
def get_my_reviews(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppReviewService.get_my_reviews(db, current_user)

@router.put("/reviews/{review_id}", response_model=ReviewResponse)
def update_review(
    review_id: int,
    review_update: ReviewUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppReviewService.update_review(db, review_id, review_update.rating, review_update.comment, current_user)

@router.delete("/reviews/{review_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_review(
    review_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    AppReviewService.delete_review(db, review_id, current_user)
    return