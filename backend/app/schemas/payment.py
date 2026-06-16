from pydantic import BaseModel
from typing import Optional, Literal
from datetime import datetime

class PaymentBase(BaseModel):
    booking_id: int
    amount: int
    method: Optional[str] = None
    status: str

# Untuk user mengeset metode pembayaran (cash, transfer, ewallet)
class PaymentMethodInput(BaseModel):
    booking_id: int
    method: Literal["cash", "transfer", "ewallet"]

# Untuk simulasi update status menjadi "paid"
class PaymentStatusUpdate(BaseModel):
    status: Literal["pending", "paid", "cancelled"]

class PaymentResponse(PaymentBase):
    id: int
    created_at: Optional[datetime] = None
    class Config:
        from_attributes = True