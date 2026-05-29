from fastapi import FastAPI
from sqlalchemy import text
from app.database import engine, Base

from app.models.user import User
from app.models.salon import Salon
from app.models.service import Service, SalonService
from app.models.booking import Booking, BookingService

from app.routers import user, salon, service, booking

app = FastAPI()

Base.metadata.create_all(bind=engine)

# 3. Daftarkan semua router
app.include_router(user.router)
app.include_router(salon.router)
app.include_router(service.router)
app.include_router(booking.router)

@app.get("/")
def root():
    return {
        "message": "GlowUp API Connected"
    }