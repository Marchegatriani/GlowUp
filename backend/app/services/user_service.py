from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from app.models.user import User
from app.models.booking import Booking, BookingService
from app.models.review import Review
from app.models.payment import Payment
from app.models.salon import Salon
from app.models.service import SalonService
from app.utils.hash import hash_password, verify_password
from app.utils.jwt import create_access_token
from app.schemas.user import UserCreate, UserLogin, UserCreateAdmin, UserUpdateAdmin

class UserService:
    @staticmethod
    def register(db: Session, user: UserCreate):
        existing_user = db.query(User).filter(User.email == user.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        
        hashed_password = hash_password(user.password)
        new_user = User(
            name=user.name,
            email=user.email,
            password=hashed_password,
            role="user"
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        
        access_token = create_access_token(data={"sub": new_user.email, "role": new_user.role})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": new_user.id,
                "name": new_user.name,
                "email": new_user.email,
                "role": new_user.role
            }
        }

    @staticmethod
    def login(db: Session, user: UserLogin):
        db_user = db.query(User).filter(User.email == user.email).first()
        if not db_user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah"
            )
        
        if not verify_password(user.password, db_user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email atau password salah"
            )
            
        if not db_user.is_active:
             raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Akun tidak aktif"
            )

        access_token = create_access_token(data={"sub": db_user.email, "role": db_user.role})
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": db_user.id,
                "name": db_user.name,
                "email": db_user.email,
                "role": db_user.role
            }
        }

    @staticmethod
    def admin_create_user(db: Session, user_in: UserCreateAdmin):
        existing_user = db.query(User).filter(User.email == user_in.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar")
        
        hashed_password = hash_password(user_in.password)
        new_user = User(
            name=user_in.name,
            email=user_in.email,
            password=hashed_password,
            role=user_in.role
        )
        db.add(new_user)
        db.commit()
        db.refresh(new_user)
        return new_user

    @staticmethod
    def admin_list_users(db: Session):
        return db.query(User).all()

    @staticmethod
    def admin_update_user(db: Session, user_id: int, user_update: UserUpdateAdmin):
        db_user = db.query(User).filter(User.id == user_id).first()
        if not db_user:
            raise HTTPException(status_code=404, detail="User tidak ditemukan")

        if user_update.name is not None:
            db_user.name = user_update.name
        if user_update.email is not None:
            existing_user = db.query(User).filter(User.email == user_update.email, User.id != user_id).first()
            if existing_user:
                raise HTTPException(status_code=400, detail="Email sudah terdaftar pada user lain")
            db_user.email = user_update.email
        if user_update.password is not None:
            db_user.password = hash_password(user_update.password)
        if user_update.role is not None:
            db_user.role = user_update.role
        if user_update.is_active is not None:
            db_user.is_active = user_update.is_active

        db.commit()
        db.refresh(db_user)
        return db_user

    @staticmethod
    def delete_user(db: Session, user: User, current_user: User):
        if user.id == current_user.id:
            raise HTTPException(status_code=400, detail="Admin tidak diperbolehkan menghapus akun sendiri")

        if user.role == "owner":
            salons = db.query(Salon).filter(Salon.owner_id == user.id).all()
            for salon in salons:
                bookings = db.query(Booking).filter(Booking.salon_id == salon.id).all()
                for b in bookings:
                    db.query(BookingService).filter(BookingService.booking_id == b.id).delete(synchronize_session=False)
                    db.query(Review).filter(Review.booking_id == b.id).delete(synchronize_session=False)
                    db.query(Payment).filter(Payment.booking_id == b.id).delete(synchronize_session=False)
                    db.delete(b)
                
                db.query(Review).filter(Review.salon_id == salon.id).delete(synchronize_session=False)
                db.query(SalonService).filter(SalonService.salon_id == salon.id).delete(synchronize_session=False)
                db.delete(salon)
        else:
            bookings = db.query(Booking).filter(Booking.user_id == user.id).all()
            for b in bookings:
                db.query(BookingService).filter(BookingService.booking_id == b.id).delete(synchronize_session=False)
                db.query(Review).filter(Review.booking_id == b.id).delete(synchronize_session=False)
                db.query(Payment).filter(Payment.booking_id == b.id).delete(synchronize_session=False)
                db.delete(b)
            
            db.query(Review).filter(Review.user_id == user.id).delete(synchronize_session=False)

        db.delete(user)
        db.commit()
