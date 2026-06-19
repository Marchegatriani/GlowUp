from pydantic import BaseModel
from typing import Optional

# --- Schemas untuk Salon Services ---
class SalonServiceCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price: int
    duration_minutes: int

class SalonServiceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[int] = None
    duration_minutes: Optional[int] = None

class SalonServiceResponse(BaseModel):
    id: int
    salon_id: int
    name: str
    description: Optional[str] = None
    price: int
    duration_minutes: int

    class Config:
        from_attributes = True