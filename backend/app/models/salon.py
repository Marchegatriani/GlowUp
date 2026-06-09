from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Time
from sqlalchemy.orm import relationship
from datetime import datetime, time
from app.database import Base

class Salon(Base):
    __tablename__ = "salons"

    id = Column(Integer, primary_key=True, index=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(100), nullable=False)
    address = Column(Text, nullable=False)
    phone_number = Column(String(20), nullable=False)
    description = Column(Text, nullable=True)
    open_time = Column(Time, nullable=False, default=time(9, 0))
    close_time = Column(Time, nullable=False, default=time(21, 0))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relasi ke tabel users (owner)
    # Di backend, kita bisa mengakses data owner dari sebuah salon melalui `salon.owner`
    owner = relationship("User", backref="salons")