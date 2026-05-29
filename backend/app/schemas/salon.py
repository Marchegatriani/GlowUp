from pydantic import BaseModel
from typing import Optional
from datetime import datetime

# Base schema untuk field yang sama-sama digunakan
class SalonBase(BaseModel):
    name: str
    address: str
    phone_number: str
    description: Optional[str] = None

# Dipakai ketika POST (Create)
class SalonCreate(SalonBase):
    pass

# Dipakai ketika PUT (Update), semua field bersifat optional
class SalonUpdate(BaseModel):
    name: Optional[str] = None
    address: Optional[str] = None
    phone_number: Optional[str] = None
    description: Optional[str] = None
    is_active: Optional[bool] = None

# Dipakai ketika mengembalikan data ke Frontend (Response)
class SalonResponse(SalonBase):
    id: int
    owner_id: int
    is_active: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        # Memberitahu Pydantic untuk membaca data dari object SQLAlchemy (bukan cuma dari Dictionary)
        from_attributes = True 