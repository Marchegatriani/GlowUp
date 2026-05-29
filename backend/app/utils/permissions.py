from fastapi import Depends, HTTPException, status
from app.models.user import User
from app.utils.auth import get_current_user

# Dependency untuk memastikan user adalah admin
def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak. Endpoint ini hanya untuk Admin."
        )
    return current_user

# Dependency untuk memastikan user adalah owner
def require_owner(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role not in ["owner", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak. Endpoint ini hanya untuk Owner Salon."
        )
    return current_user

# Dependency untuk memastikan user adalah customer biasa (jika diperlukan nanti)
def require_user(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role != "user":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Akses ditolak. Endpoint ini hanya untuk User."
        )
    return current_user