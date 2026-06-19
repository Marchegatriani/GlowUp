from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.service import SalonService
from app.models.salon import Salon
from app.models.user import User
from app.schemas.service import SalonServiceCreate, SalonServiceUpdate, SalonServiceResponse
from app.utils.permissions import require_owner

router = APIRouter(tags=["Services"])

# ==========================================
# SALON SERVICES (Dikelola oleh Owner)
# ==========================================

@router.post("/salons/{salon_id}/services", response_model=SalonServiceResponse, status_code=status.HTTP_201_CREATED)
def add_service_to_salon(
    salon_id: int,
    salon_service: SalonServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)  # HANYA OWNER/ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    # Pastikan yang menambah layanan adalah owner asli dari salon tersebut
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    # Cek apakah salon sudah memiliki layanan dengan nama yang sama
    existing_ss = db.query(SalonService).filter(
        SalonService.salon_id == salon_id,
        SalonService.name == salon_service.name
    ).first()
    if existing_ss:
        raise HTTPException(status_code=400, detail="Salon ini sudah memiliki layanan dengan nama tersebut.")

    new_ss = SalonService(
        salon_id=salon_id,
        name=salon_service.name,
        description=salon_service.description,
        price=salon_service.price,
        duration_minutes=salon_service.duration_minutes
    )
    db.add(new_ss)
    db.commit()
    db.refresh(new_ss)
    return new_ss

@router.get("/salons/{salon_id}/services", response_model=List[SalonServiceResponse])
def get_salon_services(salon_id: int, db: Session = Depends(get_db)):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    services = db.query(SalonService).filter(SalonService.salon_id == salon_id).all()
    return services

@router.put("/salons/{salon_id}/services/{service_id}", response_model=SalonServiceResponse)
def update_salon_service(
    salon_id: int,
    service_id: int,
    salon_service_update: SalonServiceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)  # HANYA OWNER/ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    ss = db.query(SalonService).filter(
        SalonService.id == service_id,
        SalonService.salon_id == salon_id
    ).first()
    if not ss:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan di salon ini")

    # Jika mengubah nama, pastikan tidak duplikat dengan layanan lain di salon yang sama
    if salon_service_update.name is not None and salon_service_update.name != ss.name:
        existing = db.query(SalonService).filter(
            SalonService.salon_id == salon_id,
            SalonService.name == salon_service_update.name
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Salon ini sudah memiliki layanan dengan nama tersebut.")

    update_data = salon_service_update.dict(exclude_unset=True)
    for key, value in update_data.items():
        setattr(ss, key, value)

    db.commit()
    db.refresh(ss)
    return ss

@router.delete("/salons/{salon_id}/services/{service_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_salon_service(
    salon_id: int,
    service_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)  # HANYA OWNER/ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    ss = db.query(SalonService).filter(
        SalonService.id == service_id,
        SalonService.salon_id == salon_id
    ).first()
    if not ss:
        raise HTTPException(status_code=404, detail="Layanan tidak ditemukan di salon ini")

    db.delete(ss)
    db.commit()
    return