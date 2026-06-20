from sqlalchemy import Column, Integer, String, Text, Boolean, ForeignKey, DateTime, Time, func, Table
from sqlalchemy.orm import relationship
from datetime import time
from app.database import Base

salon_categories = Table(
    'salon_categories', Base.metadata,
    Column('salon_id', Integer, ForeignKey('salons.id'), primary_key=True),
    Column('category_id', Integer, ForeignKey('categories.id'), primary_key=True)
)

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False, unique=True)
    
    salons = relationship("Salon", secondary=salon_categories, back_populates="categories")

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
    image_url = Column(String(255), nullable=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now())

    # Relasi ke tabel users (owner)
    # Di backend, kita bisa mengakses data owner dari sebuah salon melalui `salon.owner`
    owner = relationship("User", backref="salons")
    galleries = relationship("SalonGallery", back_populates="salon", cascade="all, delete-orphan")
    categories = relationship("Category", secondary=salon_categories, back_populates="salons")

class SalonGallery(Base):
    __tablename__ = "salon_galleries"

    id = Column(Integer, primary_key=True, index=True)
    salon_id = Column(Integer, ForeignKey("salons.id"), nullable=False)
    image_url = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    salon = relationship("Salon", back_populates="galleries")