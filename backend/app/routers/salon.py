from fastapi import APIRouter, Depends, status, Form, UploadFile, File
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.salon import SalonCreate, SalonUpdate, SalonResponse, SalonGalleryResponse, CategoryResponse
from app.utils.permissions import require_owner, require_admin
from app.services.salon_service import AppSalonService

router = APIRouter(
    prefix="/salons",
    tags=["Salons"]
)

@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return AppSalonService.get_categories(db)

@router.get("/admin/list")
def get_admin_salons_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return AppSalonService.get_admin_salons_list(db)


@router.post("/", response_model=SalonResponse, status_code=status.HTTP_201_CREATED)
def create_salon(
    name: str = Form(...),
    address: str = Form(...),
    phone_number: str = Form(...),
    open_time: str = Form(...),
    close_time: str = Form(...),
    description: str = Form(None),
    category_ids: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    return AppSalonService.create_salon(
        db, current_user, name, address, phone_number, open_time, close_time, description, category_ids, image
    )

@router.get("/", response_model=List[SalonResponse])
def get_all_salons(db: Session = Depends(get_db)):
    return AppSalonService.get_all_salons(db)

@router.get("/{salon_id}", response_model=SalonResponse)
def get_salon_detail(salon_id: int, db: Session = Depends(get_db)):
    return AppSalonService.get_salon_detail(db, salon_id)

@router.put("/{salon_id}", response_model=SalonResponse)
def update_salon(
    salon_id: int,
    name: str = Form(None),
    address: str = Form(None),
    phone_number: str = Form(None),
    open_time: str = Form(None),
    close_time: str = Form(None),
    description: str = Form(None),
    category_ids: str = Form(None),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    return AppSalonService.update_salon(
        db, salon_id, current_user, name, address, phone_number, open_time, close_time, description, category_ids, image
    )

@router.delete("/{salon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_salon(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    AppSalonService.delete_salon(db, salon_id, current_user)
    return

@router.put("/{salon_id}/status")
def toggle_salon_status(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return AppSalonService.toggle_salon_status(db, salon_id)

@router.get("/{salon_id}/admin")
def get_admin_salon_detail(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return AppSalonService.get_admin_salon_detail(db, salon_id)

@router.post("/{salon_id}/gallery", response_model=SalonGalleryResponse, status_code=status.HTTP_201_CREATED)
def add_gallery_photo(
    salon_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    return AppSalonService.add_gallery_photo(db, salon_id, image, current_user)

@router.delete("/gallery/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    AppSalonService.delete_gallery_photo(db, photo_id, current_user)
    return