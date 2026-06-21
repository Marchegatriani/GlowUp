from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User

from app.schemas.payment import PaymentResponse, PaymentMethodInput, PaymentStatusUpdate
from app.utils.auth import get_current_user
from app.services.payment_service import AppPaymentService

router = APIRouter(
    prefix="/payments",
    tags=["Payments"]
)

@router.post("/", response_model=PaymentResponse)
def set_payment_method(
    payment_in: PaymentMethodInput,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return AppPaymentService.set_payment_method(db, payment_in.booking_id, payment_in.method, current_user)

@router.get("/{booking_id}", response_model=PaymentResponse)
def get_payment_detail(booking_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    return AppPaymentService.get_payment_detail(db, booking_id, current_user)

@router.put("/{payment_id}/status", response_model=PaymentResponse)
def update_payment_status(
    payment_id: int, 
    status_update: PaymentStatusUpdate, 
    db: Session = Depends(get_db), 
    current_user: User = Depends(get_current_user)
):
    return AppPaymentService.update_payment_status(db, payment_id, status_update.status, current_user)