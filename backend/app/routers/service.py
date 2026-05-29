from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import SessionLocal
from app.models.service import Service, SalonService
from app.models.salon import Salon
from app.models.user import User
from app.schemas.service import ServiceCreate, ServiceResponse, SalonServiceCreate, SalonServiceResponse
from app.utils.permissions import require_admin, require_owner

router = APIRouter(tags=["Services"])

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# ==========================================
# MASTER SERVICES (Dikelola oleh Admin)
# ==========================================

@router.post("/services/", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_master_service(
    service: ServiceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)  # HANYA ADMIN
):
    existing = db.query(Service).filter(Service.name == service.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Service dengan nama ini sudah ada")

    new_service = Service(name=service.name, description=service.description)
    db.add(new_service)
    db.commit()
    db.refresh(new_service)
    return new_service

@router.get("/services/", response_model=List[ServiceResponse])
def get_all_master_services(db: Session = Depends(get_db)):
    return db.query(Service).all()


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

    # Cek apakah salon sudah memiliki layanan ini
    existing_ss = db.query(SalonService).filter(
        SalonService.salon_id == salon_id,
        SalonService.service_id == salon_service.service_id
    ).first()
    if existing_ss:
        raise HTTPException(status_code=400, detail="Salon ini sudah memiliki layanan tersebut.")

    new_ss = SalonService(
        salon_id=salon_id,
        service_id=salon_service.service_id,
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

    # Akan me-return daftar layanan sekaligus include detail master layanannya
    # karena kita punya relationship("Service") dan embedding di schema Pydantic
    services = db.query(SalonService).filter(SalonService.salon_id == salon_id).all()
    return services

# Catatan: Endpoint DELETE /salons/{salon_id}/services/{id} bisa ditambahkan nanti jika perlu.