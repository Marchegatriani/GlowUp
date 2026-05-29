from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# 1. Tabel Master Services (Dikelola oleh Admin)
class Service(Base):
    __tablename__ = "services"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)
    description = Column(Text, nullable=True)

    # Relasi balik ke salon_services
    salon_services = relationship("SalonService", back_populates="service")

# 2. Tabel Layanan yang ditawarkan oleh Salon (Dikelola oleh Owner)
class SalonService(Base):
    __tablename__ = "salon_services"

    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(Integer, ForeignKey("salons.id"), nullable=False)
    service_id = Column(Integer, ForeignKey("services.id"), nullable=False)
    price = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False) # Durasi pengerjaan dalam menit

    # Relasi
    salon = relationship("Salon", backref="services")
    service = relationship("Service", back_populates="salon_services")