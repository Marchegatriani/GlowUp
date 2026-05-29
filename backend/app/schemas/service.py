from pydantic import BaseModel
from typing import Optional

# --- Schemas untuk Master Services ---
class ServiceBase(BaseModel):
    name: str
    description: Optional[str] = None

class ServiceCreate(ServiceBase):
    pass

class ServiceResponse(ServiceBase):
    id: int

    class Config:
        from_attributes = True

# --- Schemas untuk Salon Services ---
class SalonServiceBase(BaseModel):
    service_id: int
    price: int
    duration_minutes: int

class SalonServiceCreate(SalonServiceBase):
    pass

class SalonServiceResponse(SalonServiceBase):
    id: int
    salon_id: int
    
    service: ServiceResponse 

    class Config:
        from_attributes = True