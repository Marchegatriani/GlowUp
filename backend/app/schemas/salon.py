from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime, time
from app.schemas.service import SalonServiceResponse

# Base schema untuk field yang sama-sama digunakan
class SalonBase(BaseModel):
    name: str
    address: str
    phone_number: str
    description: Optional[str] = None
    open_time: time = time(9, 0)
    close_time: time = time(21, 0)
    image_url: Optional[str] = None

# Dipakai ketika POST (Create)
class SalonCreate(SalonBase):
    pass

# Dipakai ketika PUT (Update), semua field bersifat optional
class SalonUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    description: Optional[str] = None
    open_time: Optional[time] = None
    close_time: Optional[time] = None
    is_active: Optional[bool] = None
    image_url: Optional[str] = None

class CategoryResponse(BaseModel):
    id: int
    name: str

    class Config:
        from_attributes = True

class SalonGalleryResponse(BaseModel):
    id: int
    salon_id: int
    image_url: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

# Dipakai ketika mengembalikan data ke Frontend (Response)
class SalonResponse(SalonBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    galleries: List[SalonGalleryResponse] = []
    categories: List[CategoryResponse] = []
    services: List[SalonServiceResponse] = []
    rating: float = 0.0
    reviews_count: int = 0

    class Config:
        # Memberitahu Pydantic untuk membaca data dari object SQLAlchemy (bukan cuma dari Dictionary)
        from_attributes = True 


# ==========================================
# SCHEMAS KHUSUS ADMIN SALONS
# ==========================================

class AdminSalonListItem(BaseModel):
    id: int
    name: str
    owner_name: str
    address: str
    phone_number: str
    is_active: bool


class AdminSalonOwnerInfo(BaseModel):
    id: int
    name: str
    email: str


class AdminSalonDetailResponse(BaseModel):
    id: int
    name: str
    address: str
    phone_number: str
    description: Optional[str] = None
    open_time: Optional[str] = None
    close_time: Optional[str] = None
    image_url: Optional[str] = None
    is_active: bool
    owner: AdminSalonOwnerInfo
    categories: List[CategoryResponse] = []