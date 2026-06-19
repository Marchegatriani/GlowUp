from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserLogin, UserCreateAdmin, UserUpdateAdmin
from app.utils.hash import hash_password, verify_password
from app.utils.auth import get_current_user
from app.utils.jwt import create_access_token
from app.utils.permissions import require_admin, require_owner

router = APIRouter()


@router.post("/register")
def register(user: UserCreate, db: Session = Depends(get_db)):

    existing_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=400,
            detail="Email sudah terdaftar"
        )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password),
        role="user"
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "message": "Registrasi berhasil",
        "user_id": new_user.id
    }

@router.post("/login")
def login(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(
            status_code=401,
            detail="Email atau password salah"
        )

    token = create_access_token({
        "sub": db_user.email,
        "role": db_user.role
    })

    return {
        "access_token": token,
        "token_type": "bearer",
        "role": db_user.role
    }

@router.get("/me")
def get_me(
    current_user: User = Depends(get_current_user)
):
    return {
        "id": current_user.id,
        "name": current_user.name,
        "email": current_user.email,
        "role": current_user.role
    }

@router.get("/admin/dashboard")
def admin_dashboard_data(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    from app.models.salon import Salon
    
    total_users = db.query(User).count()
    total_customers = db.query(User).filter(User.role == "user").count()
    total_owners = db.query(User).filter(User.role == "owner").count()
    total_salons = db.query(Salon).count()
    
    return {
        "message": "Selamat datang di Dashboard Admin",
        "admin_name": current_user.name,
        "stats": {
            "total_users": total_users,
            "total_customers": total_customers,
            "total_owners": total_owners,
            "total_salons": total_salons
        }
    }

@router.get("/owner/dashboard")
def owner_dashboard_data(
    current_user: User = Depends(require_owner),
    db: Session = Depends(get_db)
):
    from app.models.salon import Salon
    from app.models.booking import Booking, BookingService
    from app.models.review import Review
    from app.models.service import SalonService
    from datetime import datetime, timedelta
    from sqlalchemy import func, desc

    # 1. Cari salon milik owner ini
    salon = db.query(Salon).filter(Salon.owner_id == current_user.id).first()
    if not salon:
        return {
            "has_salon": False,
            "message": "Anda belum mendaftarkan salon.",
            "stats": {
                "total_bookings": 0,
                "total_revenue": "Rp 0",
                "avg_rating": 0,
                "review_count": 0
            },
            "recent_bookings": [],
            "weekly_revenue": [],
            "popular_services": []
        }

    # 2. Hitung statistik dasar
    total_bookings = db.query(Booking).filter(Booking.salon_id == salon.id).count()
    
    total_revenue = db.query(func.sum(Booking.total_price)).filter(
        Booking.salon_id == salon.id,
        Booking.status.in_(["confirmed", "completed"])
    ).scalar() or 0

    avg_rating = db.query(func.avg(Review.rating)).filter(Review.salon_id == salon.id).scalar() or 0
    avg_rating = round(float(avg_rating), 1)

    review_count = db.query(Review).filter(Review.salon_id == salon.id).count()

    # 3. Booking Terbaru (limit 5)
    bookings_query = db.query(Booking).filter(
        Booking.salon_id == salon.id
    ).order_by(Booking.booking_time.desc()).limit(5).all()

    recent_bookings = []
    for b in bookings_query:
        # Ambil customer name & email
        cust_name = b.user.name if b.user else "Pelanggan"
        cust_email = b.user.email if b.user else ""
        
        # Ambil list layanan (concatenated)
        svc_names = []
        for bs in b.services:
            if bs.salon_service:
                svc_names.append(bs.salon_service.name)
        svc_str = ", ".join(svc_names) if svc_names else "Layanan Salon"

        status_text = b.status.upper()

        recent_bookings.append({
            "id": b.id,
            "name": cust_name,
            "email": cust_email,
            "service": svc_str,
            "date": b.booking_time.strftime("%d %b %Y"),
            "time": b.booking_time.strftime("%H:%M") + " WIB",
            "total": f"Rp {b.total_price:,}".replace(",", "."),
            "status": status_text
        })

    # 4. Statistik Mingguan (7 hari terakhir)
    today = datetime.now()
    weekly_revenue = []
    max_rev = 1  # untuk menghitung rasio tinggi bar
    
    # Kumpulkan revenue harian
    days_data = []
    for i in range(7):
        day = today - timedelta(days=6-i)
        day_start = datetime(day.year, day.month, day.day, 0, 0, 0)
        day_end = datetime(day.year, day.month, day.day, 23, 59, 59)
        
        day_revenue = db.query(func.sum(Booking.total_price)).filter(
            Booking.salon_id == salon.id,
            Booking.status.in_(["confirmed", "completed"]),
            Booking.booking_time >= day_start,
            Booking.booking_time <= day_end
        ).scalar() or 0
        
        if day_revenue > max_rev:
            max_rev = day_revenue
            
        days_data.append({
            "day_name": day.strftime("%a"), # "Sen", "Sel", dst
            "value": int(day_revenue)
        })
    
    # Terjemahkan nama hari ke Indonesia & hitung tinggi bar (max 100%)
    day_translation = {
        "Mon": "Sen", "Tue": "Sel", "Wed": "Rab", 
        "Thu": "Kam", "Fri": "Jum", "Sat": "Sab", "Sun": "Min"
    }
    
    for d in days_data:
        day_id = day_translation.get(d["day_name"], d["day_name"])
        val = d["value"]
        
        # Format label: misal 1.250.000 -> "Rp 1.2jt" atau 450.000 -> "Rp 450rb"
        label = "Rp 0"
        if val >= 1000000:
            label = f"Rp {val/1000000:.1f}Jt"
        elif val >= 1000:
            label = f"Rp {val/1000:.0f}Rb"
            
        height = int((val / max_rev) * 100) if max_rev > 0 else 0
        if height < 5 and val > 0:
            height = 10 # tinggi minimal jika ada nilai
            
        weekly_revenue.append({
            "day": day_id,
            "value": val,
            "label": label,
            "height": height
        })

    # 5. Layanan Populer (Top 3)
    popular_query = db.query(
        BookingService.salon_service_id,
        func.count(BookingService.id).label("count")
    ).join(Booking).filter(
        Booking.salon_id == salon.id
    ).group_by(
        BookingService.salon_service_id
    ).order_by(
        desc("count")
    ).limit(3).all()

    popular_services = []
    for item in popular_query:
        ss = db.query(SalonService).filter(SalonService.id == item.salon_service_id).first()
        if ss:
            # Generate a consistent placeholder image based on service id
            popular_services.append({
                "name": ss.name,
                "bookings": f"{item.count} Booking",
                "price": f"Rp {ss.price:,}".replace(",", "."),
                "img": f"https://api.builder.io/api/v1/image/assets/TEMP/bd798f11415ca0348620620846272411656ea963?width=112"
            })

    return {
        "has_salon": True,
        "salon_name": salon.name,
        "stats": {
            "total_bookings": total_bookings,
            "total_revenue": f"Rp {total_revenue:,}".replace(",", "."),
            "avg_rating": avg_rating,
            "review_count": review_count
        },
        "recent_bookings": recent_bookings,
        "weekly_revenue": weekly_revenue,
        "popular_services": popular_services
    }


from app.models.booking import Booking
from app.models.review import Review

@router.get("/customer/dashboard")
def customer_dashboard_data(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Menampilkan data ringkasan untuk Dashboard Customer.
    Menghitung jumlah booking aktif (Pending/Confirmed) dan total review yang sudah diberikan.
    """
    # 1. Hitung jumlah booking aktif
    active_bookings_count = db.query(Booking).filter(
        Booking.user_id == current_user.id,
        Booking.status.in_(["pending", "confirmed"])
    ).count()

    # 2. Hitung total review yang pernah diberikan user ini
    total_reviews_count = db.query(Review).filter(
        Review.user_id == current_user.id
    ).count()

    return {
        "message": f"Selamat datang di Dashboard, {current_user.name}",
        "user_info": {
            "name": current_user.name,
            "email": current_user.email
        },
        "stats": {
            "active_bookings_count": active_bookings_count,
            "total_reviews_given": total_reviews_count
        }
    }

from typing import List
from app.schemas.user import UserResponse

@router.post("/admin/users", status_code=201)
def admin_create_user(
    user_in: UserCreateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    existing_user = db.query(User).filter(User.email == user_in.email).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Email sudah terdaftar")
    
    new_user = User(
        name=user_in.name,
        email=user_in.email,
        password=hash_password(user_in.password),
        role=user_in.role,
        is_active=True
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {
        "message": "User berhasil dibuat oleh Admin",
        "user_id": new_user.id
    }

@router.get("/admin/users", response_model=List[UserResponse])
def admin_list_users(
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    return db.query(User).all()

@router.put("/admin/users/{user_id}", response_model=UserResponse)
def admin_update_user(
    user_id: int,
    user_update: UserUpdateAdmin,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    if user_update.email is not None and user_update.email != user.email:
        existing = db.query(User).filter(User.email == user_update.email).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email sudah terdaftar untuk user lain")

    update_data = user_update.dict(exclude_unset=True)
    if "password" in update_data and update_data["password"]:
        user.password = hash_password(update_data["password"])
        del update_data["password"]
    elif "password" in update_data:
        del update_data["password"]

    for key, value in update_data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user

@router.delete("/admin/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def admin_delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    from fastapi import status as fastapi_status
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User tidak ditemukan")

    # Mencegah admin menghapus dirinya sendiri
    if user.id == current_user.id:
        raise HTTPException(status_code=400, detail="Admin tidak diperbolehkan menghapus akun sendiri")

    from app.models.booking import Booking, BookingService
    from app.models.review import Review
    from app.models.payment import Payment
    from app.models.salon import Salon
    from app.models.service import SalonService

    # 1. Cascade delete bookings and related tables (payments, reviews, booking_services)
    # Jika user adalah Owner, hapus salon dan semua bookings di salon tersebut
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

    # Jika user adalah customer (user biasa), hapus bookings milik customer tersebut
    else:
        bookings = db.query(Booking).filter(Booking.user_id == user.id).all()
        for b in bookings:
            db.query(BookingService).filter(BookingService.booking_id == b.id).delete(synchronize_session=False)
            db.query(Review).filter(Review.booking_id == b.id).delete(synchronize_session=False)
            db.query(Payment).filter(Payment.booking_id == b.id).delete(synchronize_session=False)
            db.delete(b)
        
        # Hapus review yang ditulis oleh user ini
        db.query(Review).filter(Review.user_id == user.id).delete(synchronize_session=False)

    # 2. Hapus User
    db.delete(user)
    db.commit()
    return