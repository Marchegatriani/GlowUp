from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from app.schemas.salon import SalonResponse

# Schema untuk input saat user membuat review
class ReviewCreate(BaseModel):
    booking_id: int
    # Validasi Pydantic: ge = greater than or equal to 1, le = less than or equal to 5
    rating: int = Field(..., ge=1, le=5, description="Rating harus antara 1 dan 5")
    comment: Optional[str] = None

# Schema untuk response API
class ReviewResponse(BaseModel):
    id: int
    user_id: int
    salon_id: int
    booking_id: int
    rating: int
    comment: Optional[str]
    created_at: Optional[datetime] = None
    salon: Optional[SalonResponse] = None

    class Config:
        from_attributes = True