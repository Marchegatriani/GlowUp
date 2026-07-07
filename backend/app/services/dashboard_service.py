from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from app.models.user import User
from app.models.salon import Salon
from app.models.booking import Booking, BookingService
from app.models.review import Review
from app.models.service import SalonService

class DashboardService:
    @staticmethod
    def get_admin_dashboard_data(db: Session, current_user: User):
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

    @staticmethod
    def get_owner_dashboard_data(db: Session, current_user: User):
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
            cust_name = b.user.name if b.user else "Pelanggan"
            cust_email = b.user.email if b.user else ""
            
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
                "time": b.booking_time.strftime("%H:%M") + " WITA",
                "total": f"Rp {b.total_price:,}".replace(",", "."),
                "status": status_text
            })

        # 4. Statistik Mingguan (7 hari terakhir)
        today = datetime.now()
        weekly_revenue = []
        max_rev = 1
        
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
                "day_name": day.strftime("%a"),
                "value": int(day_revenue)
            })
        
        day_translation = {
            "Mon": "Sen", "Tue": "Sel", "Wed": "Rab", 
            "Thu": "Kam", "Fri": "Jum", "Sat": "Sab", "Sun": "Min"
        }
        
        for d in days_data:
            day_id = day_translation.get(d["day_name"], d["day_name"])
            val = d["value"]
            
            label = "Rp 0"
            if val >= 1000000:
                label = f"Rp {val/1000000:.1f}Jt"
            elif val >= 1000:
                label = f"Rp {val/1000:.0f}Rb"
                
            height = int((val / max_rev) * 100) if max_rev > 0 else 0
            if height < 5 and val > 0:
                height = 10
                
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

    @staticmethod
    def get_customer_dashboard_data(db: Session, current_user: User):
        active_bookings_count = db.query(Booking).filter(
            Booking.user_id == current_user.id,
            Booking.status.in_(["pending", "confirmed"])
        ).count()

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
