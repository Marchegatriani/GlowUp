from fastapi import APIRouter, Depends, HTTPException, status, Form, UploadFile, File
import os
import uuid
import shutil
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.salon import Salon, SalonGallery, Category
from app.models.user import User
from app.models.review import Review
from sqlalchemy import func
from app.schemas.salon import SalonCreate, SalonUpdate, SalonResponse, SalonGalleryResponse, CategoryResponse
from app.utils.permissions import require_owner, require_admin

router = APIRouter(
    prefix="/salons",
    tags=["Salons"]
)

# 0. Get all categories
@router.get("/categories", response_model=List[CategoryResponse])
def get_categories(db: Session = Depends(get_db)):
    return db.query(Category).all()

# 1.5. Admin: Get All Salons with details
@router.get("/admin/list")
def get_admin_salons_list(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    salons = db.query(Salon).all()
    result = []
    for s in salons:
        result.append({
            "id": s.id,
            "name": s.name,
            "owner_name": s.owner.name if s.owner else "Tidak diketahui",
            "address": s.address,
            "phone_number": s.phone_number,
            "is_active": s.is_active
        })
    return result


# 1. Create Salon
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
    current_user: User = Depends(require_owner)  # WAJIB OWNER / ADMIN
):
    # Cek apakah owner sudah mendaftarkan salon
    existing_salon = db.query(Salon).filter(Salon.owner_id == current_user.id).first()
    if existing_salon:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Anda sudah memiliki salon yang terdaftar. Silakan edit profil salon Anda jika ada perubahan."
        )

    image_url = None
    if image and image.filename:
        ext = image.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join("uploads", filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"http://localhost:8000/uploads/{filename}"

    new_salon = Salon(
        owner_id=current_user.id, # Ambil ID owner dari token yang sedang login
        name=name,
        address=address,
        phone_number=phone_number,
        description=description,
        open_time=open_time,
        close_time=close_time,
        image_url=image_url
    )
    
    if category_ids:
        cat_id_list = [int(cid.strip()) for cid in category_ids.split(",") if cid.strip().isdigit()]
        categories = db.query(Category).filter(Category.id.in_(cat_id_list)).all()
        new_salon.categories = categories

    db.add(new_salon)
    db.commit()
    db.refresh(new_salon)
    return new_salon

# 2. Get All Salons (Public)
@router.get("/", response_model=List[SalonResponse])
def get_all_salons(db: Session = Depends(get_db)):
    salons = db.query(Salon).join(User, Salon.owner_id == User.id).filter(
        Salon.is_active == True,
        User.is_active == True
    ).all()
    
    for salon in salons:
        avg_rating = db.query(func.avg(Review.rating)).filter(Review.salon_id == salon.id).scalar() or 0
        review_count = db.query(Review).filter(Review.salon_id == salon.id).count()
        salon.rating = round(float(avg_rating), 1)
        salon.reviews_count = review_count
        
    return salons

# 3. Get Salon By ID (Public)
@router.get("/{salon_id}", response_model=SalonResponse)
def get_salon_detail(salon_id: int, db: Session = Depends(get_db)):
    salon = db.query(Salon).join(User, Salon.owner_id == User.id).filter(
        Salon.id == salon_id,
        Salon.is_active == True,
        User.is_active == True
    ).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan atau sedang tidak aktif")
        
    avg_rating = db.query(func.avg(Review.rating)).filter(Review.salon_id == salon.id).scalar() or 0
    review_count = db.query(Review).filter(Review.salon_id == salon.id).count()
    salon.rating = round(float(avg_rating), 1)
    salon.reviews_count = review_count
    
    return salon

# 4. Update Salon
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
    current_user: User = Depends(require_owner)  # WAJIB OWNER / ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    # Cek Otentikasi Ekstra: Pastikan Owner hanya mengedit salon miliknya sendiri
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    if name is not None: salon.name = name
    if address is not None: salon.address = address
    if phone_number is not None: salon.phone_number = phone_number
    if description is not None: salon.description = description
    if open_time is not None: salon.open_time = open_time
    if close_time is not None: salon.close_time = close_time

    if image and image.filename:
        ext = image.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join("uploads", filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        salon.image_url = f"http://localhost:8000/uploads/{filename}"

    if category_ids is not None:
        if category_ids.strip() == "":
            salon.categories = []
        else:
            cat_id_list = [int(cid.strip()) for cid in category_ids.split(",") if cid.strip().isdigit()]
            categories = db.query(Category).filter(Category.id.in_(cat_id_list)).all()
            salon.categories = categories

    db.commit()
    db.refresh(salon)
    return salon

# 5. Delete Salon
@router.delete("/{salon_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_salon(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)  # WAJIB OWNER / ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    db.delete(salon)
    db.commit()
    return

# 6. Admin: Toggle Salon Status
@router.put("/{salon_id}/status")
def toggle_salon_status(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
    
    salon.is_active = not salon.is_active
    db.commit()
    db.refresh(salon)
    return {"message": "Status salon berhasil diubah", "is_active": salon.is_active}

# 7. Admin: Get Salon details with owner info
@router.get("/{salon_id}/admin")
def get_admin_salon_detail(
    salon_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
    
    return {
        "id": salon.id,
        "name": salon.name,
        "address": salon.address,
        "phone_number": salon.phone_number,
        "description": salon.description,
        "open_time": salon.open_time.strftime("%H:%M") if salon.open_time else None,
        "close_time": salon.close_time.strftime("%H:%M") if salon.close_time else None,
        "image_url": salon.image_url,
        "is_active": salon.is_active,
        "owner": {
            "id": salon.owner.id,
            "name": salon.owner.name,
            "email": salon.owner.email
        },
        "categories": [
            {"id": c.id, "name": c.name} for c in salon.categories
        ]
    }

# 8. Owner: Add Photo to Gallery
@router.post("/{salon_id}/gallery", response_model=SalonGalleryResponse, status_code=status.HTTP_201_CREATED)
def add_gallery_photo(
    salon_id: int,
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")
    
    if image and image.filename:
        ext = image.filename.split('.')[-1]
        filename = f"{uuid.uuid4()}.{ext}"
        filepath = os.path.join("uploads", filename)
        with open(filepath, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        image_url = f"http://localhost:8000/uploads/{filename}"
        
        new_photo = SalonGallery(
            salon_id=salon_id,
            image_url=image_url
        )
        db.add(new_photo)
        db.commit()
        db.refresh(new_photo)
        return new_photo
    else:
        raise HTTPException(status_code=400, detail="File gambar tidak valid")

# 9. Owner: Delete Photo from Gallery
@router.delete("/gallery/{photo_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_gallery_photo(
    photo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)
):
    photo = db.query(SalonGallery).filter(SalonGallery.id == photo_id).first()
    if not photo:
        raise HTTPException(status_code=404, detail="Foto tidak ditemukan")
        
    salon = photo.salon
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")
        
    # Optional: Delete file from storage here if needed
    filename = photo.image_url.split('/')[-1]
    filepath = os.path.join("uploads", filename)
    if os.path.exists(filepath):
        try:
            os.remove(filepath)
        except:
            pass
            
    db.delete(photo)
    db.commit()
    return