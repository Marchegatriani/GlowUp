from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class PaymentBase(BaseModel):
    booking_id: int
    amount: int
    method: Optional[str] = None
    status: str

# Untuk user mengeset metode pembayaran (cash, transfer, ewallet)
class PaymentMethodInput(BaseModel):
    booking_id: int
    method: str 

# Untuk simulasi update status menjadi "paid"
class PaymentStatusUpdate(BaseModel):
    status: str 

class PaymentResponse(PaymentBase):
    id: int
    created_at: datetime
    class Config:
        from_attributes = True