from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.database import engine, Base, SessionLocal
from app.utils.hash import hash_password

# 1. Import semua model di sini agar SQLAlchemy mendeteksinya
from app.models.user import User
from app.models.salon import Salon
from app.models.service import Service, SalonService
from app.models.booking import Booking, BookingService
from app.models.payment import Payment
from app.models.review import Review

# 2. Import semua router
from app.routers import user, salon, service, booking, payment, review

app = FastAPI()

@app.on_event("startup")
def startup_setup():
    db = SessionLocal()
    try:
        # 1. Jalankan migrasi mandiri untuk kolom image_url jika belum ada
        try:
            db.execute(text("ALTER TABLE salons ADD COLUMN image_url VARCHAR(255) NULL"))
            db.commit()
            print("Database migration: Added image_url column to salons table successfully.")
        except Exception as e:
            # Jika kolom sudah ada, abaikan error
            db.rollback()
        
        # 2. Inisialisasi akun admin default
        admin = db.query(User).filter(User.role == "admin").first()
        if not admin:
            default_admin = User(
                name="Admin GlowUp",
                email="admin@glowup.com",
                password=hash_password("admin123"),
                role="admin",
                is_active=True
            )
            db.add(default_admin)
            db.commit()
            print("Initial admin created: admin@glowup.com / admin123")
    except Exception as e:
        print(f"Error during startup setup: {e}")
    finally:
        db.close()

# Konfigurasi CORS
origins = [
    "http://localhost:5173",  # Origin standar Vite React
    "http://127.0.0.1:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# 3. Daftarkan semua router
app.include_router(user.router)
app.include_router(salon.router)
app.include_router(service.router)
app.include_router(booking.router)
app.include_router(payment.router)
app.include_router(review.router)

@app.get("/")
def root():
    return {
        "message": "GlowUp API Connected"
    }