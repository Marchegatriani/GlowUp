from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin
from app.utils.hash import hash_password, verify_password
from app.utils.auth import get_current_user
from app.utils.jwt import create_access_token
from app.utils.permissions import require_admin, require_owner

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registrasi berhasil",
        "user_id": new_user.id
    }

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.get("/admin/dashboard")
def admin_dashboard_data(
    current_user: User = Depends(require_admin)
):
    return {
        "message": "Selamat datang di Dashboard Admin",
        "admin_data": current_user.name
    }

@router.get("/owner/dashboard")
def owner_dashboard_data(
    current_user: User = Depends(require_owner)
):
    return {
        "message": "Selamat datang di Dashboard Owner Salon",
        "owner_data": current_user.name
    }

from app.models.booking import Booking
from app.models.review import Review

@router.get("/customer/dashboard")
def customer_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Menampilkan data ringkasan untuk Dashboard Customer.
    Menghitung jumlah booking aktif (Pending/Confirmed) dan total review yang sudah diberikan.
    """
    # 1. Hitung jumlah booking aktif
    active_bookings_count = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.status.in_(["pending", "confirmed"])
    ).count()

    # 2. Hitung total review yang pernah diberikan user ini
    total_reviews_count = db.query(Review).filter(
        Review.user_id == current_user.id
    ).count()

    return {
        "message": f"Selamat datang di Dashboard, {current_user.name}",
        "user_info": {
            "name": current_user.name,
            "email": current_user.email
        },
        "stats": {
            "active_bookings_count": active_bookings_count,
            "total_reviews_given": total_reviews_count
        }
    }