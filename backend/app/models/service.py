from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from app.database import Base

# Tabel Layanan yang ditawarkan oleh Salon (Dikelola oleh Owner)
class SalonService(Base):
    __tablename__ = "salon_services"

    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(Integer, ForeignKey("salons.id"), nullable=False)
    name = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Integer, nullable=False)
    duration_minutes = Column(Integer, nullable=False) # Durasi pengerjaan dalam menit

    # Relasi
    salon = relationship("Salon", backref="services")