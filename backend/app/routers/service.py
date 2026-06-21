from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.service import SalonServiceCreate, SalonServiceUpdate, SalonServiceResponse
from app.utils.permissions import require_owner
from app.services.service_service import AppServiceService

router = APIRouter(tags=["Services"])

@router.post("/salons/{salon_id}/services", response_model=SalonServiceResponse, status_code=status.HTTP_201_CREATED)
def add_service_to_salon(
    salon_id: int,
    salon_service: SalonServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    return AppServiceService.add_service_to_salon(db, salon_id, salon_service, current_user)

@router.get("/salons/{salon_id}/services", response_model=List[SalonServiceResponse])
def get_salon_services(salon_id: int, db: Session = Depends(get_db)):
    return AppServiceService.get_salon_services(db, salon_id)

@router.put("/salons/{salon_id}/services/{service_id}", response_model=SalonServiceResponse)
def update_salon_service(
    salon_id: int,
    service_id: int,
    salon_service_update: SalonServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    return AppServiceService.update_salon_service(db, salon_id, service_id, salon_service_update, current_user)

@router.delete("/salons/{salon_id}/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_salon_service(
    salon_id: int,
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    AppServiceService.delete_salon_service(db, salon_id, service_id, current_user)
    return