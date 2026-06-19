from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.salon import Salon
from app.models.user import User
from app.schemas.salon import SalonCreate, SalonUpdate, SalonResponse
from app.utils.permissions import require_owner, require_admin

router = APIRouter(
    prefix="/salons",
    tags=["Salons"]
)

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
    salon: SalonCreate,
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

    new_salon = Salon(
        owner_id=current_user.id, # Ambil ID owner dari token yang sedang login
        name=salon.name,
        address=salon.address,
        phone_number=salon.phone_number,
        description=salon.description,
        open_time=salon.open_time,
        close_time=salon.close_time,
        image_url=salon.image_url
    )
    db.add(new_salon)
    db.commit()
    db.refresh(new_salon)
    return new_salon

# 2. Get All Salons (Public)
@router.get("/", response_model=List[SalonResponse])
def get_all_salons(db: Session = Depends(get_db)):
    salons = db.query(Salon).all()
    return salons

# 3. Get Salon By ID (Public)
@router.get("/{salon_id}", response_model=SalonResponse)
def get_salon_detail(salon_id: int, db: Session = Depends(get_db)):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")
    return salon

# 4. Update Salon
@router.put("/{salon_id}", response_model=SalonResponse)
def update_salon(
    salon_id: int,
    salon_update: SalonUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_owner)  # WAJIB OWNER / ADMIN
):
    salon = db.query(Salon).filter(Salon.id == salon_id).first()
    if not salon:
        raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

    # Cek Otentikasi Ekstra: Pastikan Owner hanya mengedit salon miliknya sendiri
    if salon.owner_id != current_user.id and current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Akses ditolak. Anda bukan pemilik salon ini.")

    update_data = salon_update.dict(exclude_unset=True) # Hanya ambil data yang dikirimkan (tidak None)
    for key, value in update_data.items():
        setattr(salon, key, value)

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
        }
    }