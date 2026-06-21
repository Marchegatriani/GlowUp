from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.service import SalonService
from app.models.salon import Salon
from app.models.user import User
from app.schemas.service import SalonServiceCreate, SalonServiceUpdate

class AppServiceService:
    @staticmethod
    def add_service_to_salon(db: Session, salon_id: int, salon_service: SalonServiceCreate, current_user: User):
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

        if salon.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

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

    @staticmethod
    def get_salon_services(db: Session, salon_id: int):
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

        services = db.query(SalonService).filter(SalonService.salon_id == salon_id).all()
        return services

    @staticmethod
    def update_salon_service(db: Session, salon_id: int, service_id: int, salon_service_update: SalonServiceUpdate, current_user: User):
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

    @staticmethod
    def delete_salon_service(db: Session, salon_id: int, service_id: int, current_user: User):
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
