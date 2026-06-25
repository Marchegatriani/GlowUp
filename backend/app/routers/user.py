from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserCreateAdmin, UserUpdateAdmin, UserResponse
from app.schemas.dashboard import AdminDashboardResponse, OwnerDashboardResponse, CustomerDashboardResponse
from app.utils.auth import get_current_user
from app.utils.permissions import require_admin, require_owner
from app.services.dashboard_service import DashboardService
from app.services.user_service import UserService

router = APIRouter()

@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):
    return UserService.register(db, user)

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    return UserService.login(db, user)

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.get("/admin/dashboard", response_model=AdminDashboardResponse)
def admin_dashboard_data(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    return DashboardService.get_admin_dashboard_data(db, current_user)

@router.get("/owner/dashboard", response_model=OwnerDashboardResponse)
def owner_dashboard_data(
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db)
):
    return DashboardService.get_owner_dashboard_data(db, current_user)

@router.get("/customer/dashboard", response_model=CustomerDashboardResponse)
def customer_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return DashboardService.get_customer_dashboard_data(db, current_user)

@router.post("/admin/users", status_code=201)
def admin_create_user(
    user_in: UserCreateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return UserService.admin_create_user(db, user_in)

@router.get("/admin/users", response_model=List[UserResponse])
def admin_list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return UserService.admin_list_users(db)

@router.put("/admin/users/{user_id}", response_model=UserResponse)
def admin_update_user(
    user_id: int,
    user_update: UserUpdateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return UserService.admin_update_user(db, user_id, user_update)

@router.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    UserService.delete_user(db, user, current_user)
    return