from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

# 1. Tabel Utama Booking
class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    salon_id = Column(Integer, ForeignKey("salons.id"), nullable=False)
    booking_time = Column(DateTime, nullable=False)
    # Status bisa berupa: pending, confirmed, completed, cancelled
    status = Column(String(50), default="pending") 
    total_price = Column(Integer, nullable=False, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relasi
    user = relationship("User", backref="bookings")
    salon = relationship("Salon", backref="bookings")
    # Relasi ke layanan yang di-booking
    services = relationship("BookingService", back_populates="booking")
    # Relasi One-to-One ke tabel payments
    payment = relationship("Payment", back_populates="booking", uselist=False)
    # Relasi One-to-One ke tabel reviews
    review = relationship("Review", back_populates="booking", uselist=False)

# 2. Tabel Detail Layanan yang di-booking
class BookingService(Base):
    __tablename__ = "booking_services"

    id = Column(Integer, primary_key=True, index=True)
    booking_id = Column(Integer, ForeignKey("bookings.id"), nullable=False)
    salon_service_id = Column(Integer, ForeignKey("salon_services.id"), nullable=False)
    price = Column(Integer, nullable=False) # Menyimpan harga saat booking dibuat

    booking = relationship("Booking", back_populates="services")
    salon_service = relationship("SalonService")