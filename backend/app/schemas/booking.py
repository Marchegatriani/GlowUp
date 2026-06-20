from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime
from app.schemas.salon import SalonResponse
from app.schemas.service import SalonServiceResponse
from app.schemas.user import UserResponse
from app.schemas.review import ReviewResponse

# Schema untuk response detail layanan yang di-booking
class BookingServiceResponse(BaseModel):
    salon_service_id: int
    price: int
    salon_service: Optional[SalonServiceResponse] = None
    
    class Config:
      from_attributes = True

# Base data untuk pembuatan booking
class BookingBase(BaseModel):
    salon_id: int
    booking_time: datetime

# Saat user membuat booking, mereka hanya mengirim ID salon, jam, dan list layanan
class BookingCreate(BookingBase):
    service_ids: List[int] # Berisi ID dari tabel salon_services

# Untuk mengupdate status booking (oleh Owner/Admin)
class BookingStatusUpdate(BaseModel):
    status: str

# Response utuh ketika berhasil
class BookingResponse(BookingBase):
    id: int
    user_id: int
    status: str
    total_price: int
    services: List[BookingServiceResponse] # Menampilkan list layanan di dalam object ini
    salon: Optional[SalonResponse] = None
    user: Optional[UserResponse] = None
    review: Optional[ReviewResponse] = None

    class Config:
        from_attributes = True

class AvailableSlot(BaseModel):
    time: str
    available: bool

class AvailableSlotsResponse(BaseModel):
    slots: List[AvailableSlot]