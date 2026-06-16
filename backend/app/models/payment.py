from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from app.database import Base

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False, unique=True)
    amount = Column(Integer, nullable=False)
    # Metode bisa: cash, transfer, ewallet (awalnya bisa kosong/null sebelum dipilih)
    method = Column(String(50), nullable=True) 
    # Status: pending, paid, cancelled
    status = Column(String(50), default="pending") 
    created_at = Column(DateTime, server_default=func.now())

    # Relasi balik ke Booking
    booking = relationship("Booking", back_populates="payment")