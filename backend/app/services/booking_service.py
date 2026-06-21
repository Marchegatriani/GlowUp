from sqlalchemy.orm import Session
from fastapi import HTTPException, status
from datetime import datetime, timedelta, date, time
from app.models.booking import Booking, BookingService
from app.models.salon import Salon
from app.models.service import SalonService
from app.models.user import User
from app.models.payment import Payment
from app.schemas.booking import BookingCreate

class AppBookingService:
    @staticmethod
    def get_available_slots(db: Session, salon_id: int, target_date: date, service_id: int):
        salon = db.query(Salon).filter(Salon.id == salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

        service = db.query(SalonService).filter(SalonService.id == service_id, SalonService.salon_id == salon_id).first()
        if not service:
            raise HTTPException(status_code=404, detail="Layanan tidak ditemukan di salon ini")

        duration = service.duration_minutes

        start_of_day = datetime.combine(target_date, time.min)
        end_of_day = datetime.combine(target_date, time.max)
        
        existing_bookings = db.query(Booking).filter(
            Booking.salon_id == salon_id,
            Booking.booking_time >= start_of_day,
            Booking.booking_time <= end_of_day,
            Booking.status.in_(["pending", "confirmed"])
        ).all()

        slots = []
        current_time = datetime.combine(target_date, salon.open_time)
        close_time_dt = datetime.combine(target_date, salon.close_time)
        now = datetime.now()

        while True:
            slot_end_time = current_time + timedelta(minutes=duration)
            if slot_end_time > close_time_dt:
                break
                
            is_available = True
            
            if current_time < now:
                is_available = False
            else:
                for b in existing_bookings:
                    b_start = b.booking_time
                    b_end = b.end_time if b.end_time else b_start + timedelta(minutes=duration)
                    
                    overlap_start = max(current_time, b_start)
                    overlap_end = min(slot_end_time, b_end)
                    
                    if overlap_start < overlap_end:
                        is_available = False
                        break

            slots.append({
                "time": current_time.strftime("%H:%M"),
                "available": is_available
            })
            
            current_time = slot_end_time

        return {"slots": slots}

    @staticmethod
    def create_booking(db: Session, booking_in: BookingCreate, current_user: User):
        salon = db.query(Salon).filter(Salon.id == booking_in.salon_id).first()
        if not salon:
            raise HTTPException(status_code=404, detail="Salon tidak ditemukan")

        booking_time_only = booking_in.booking_time.time()
        if booking_time_only < salon.open_time or booking_time_only > salon.close_time:
            raise HTTPException(
                status_code=400, 
                detail=f"Waktu booking di luar jam operasional salon ({salon.open_time.strftime('%H:%M')} - {salon.close_time.strftime('%H:%M')})"
            )

        existing_booking = db.query(Booking).filter(
            Booking.salon_id == booking_in.salon_id,
            Booking.booking_time == booking_in.booking_time,
            Booking.status.in_(["pending", "confirmed"])
        ).first()

        if existing_booking:
            raise HTTPException(status_code=400, detail="Jadwal pada jam tersebut sudah di-booking oleh orang lain. Silakan pilih waktu lain.")

        total_price = 0
        total_duration_minutes = 0
        valid_services = []

        for s_id in booking_in.service_ids:
            salon_service = db.query(SalonService).filter(
                SalonService.id == s_id,
                SalonService.salon_id == booking_in.salon_id
            ).first()
            
            if not salon_service:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Layanan dengan ID {s_id} tidak tersedia di salon ini"
                )
            
            total_price += salon_service.price
            total_duration_minutes += salon_service.duration_minutes
            valid_services.append(salon_service)

        if not valid_services:
            raise HTTPException(status_code=400, detail="Minimal pilih satu layanan untuk di-booking")

        end_time = booking_in.booking_time + timedelta(minutes=total_duration_minutes)

        new_booking = Booking(
            user_id=current_user.id,
            salon_id=booking_in.salon_id,
            booking_time=booking_in.booking_time,
            end_time=end_time,
            total_price=total_price,
            status="pending"
        )
        db.add(new_booking)
        db.flush()

        for srv in valid_services:
            booking_service = BookingService(
                booking_id=new_booking.id,
                salon_service_id=srv.id,
                price=srv.price
            )
            db.add(booking_service)
        
        db.commit()
        db.refresh(new_booking)

        new_payment = Payment(
            booking_id=new_booking.id,
            amount=new_booking.total_price,
            status="pending"
        )
        db.add(new_payment)
        db.commit()

        return new_booking

    @staticmethod
    def update_owner_status(db: Session, booking_id: int, status_val: str, current_user: User):
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

        salon = db.query(Salon).filter(Salon.id == booking.salon_id).first()
        if salon.owner_id != current_user.id and current_user.role != "admin":
            raise HTTPException(status_code=403, detail="Akses ditolak. Ini bukan booking untuk salon Anda.")

        valid_statuses = ["pending", "confirmed", "completed", "cancelled"]
        if status_val not in valid_statuses:
            raise HTTPException(status_code=400, detail="Status tidak valid")

        if status_val == "cancelled" and booking.status == "confirmed" and current_user.role != "admin":
            raise HTTPException(
                status_code=400, 
                detail="Owner tidak dapat membatalkan booking yang sudah dibayar oleh Customer."
            )

        if status_val == "completed" and booking.booking_time > datetime.now():
            raise HTTPException(
                status_code=400, 
                detail="Booking belum bisa diselesaikan karena tanggal/waktu appointment belum tiba."
            )

        booking.status = status_val
        db.commit()
        db.refresh(booking)
        return booking

    @staticmethod
    def update_user_status(db: Session, booking_id: int, status_val: str, current_user: User):
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")

        if booking.user_id != current_user.id:
            raise HTTPException(status_code=403, detail="Akses ditolak. Ini bukan booking Anda.")

        valid_statuses = ["completed", "cancelled"]
        if status_val not in valid_statuses:
            raise HTTPException(status_code=400, detail="Status tidak valid. User hanya dapat menyelesaikan atau membatalkan pesanan.")

        if status_val == "completed" and booking.booking_time > datetime.now():
            raise HTTPException(
                status_code=400, 
                detail="Booking belum bisa diselesaikan karena waktu appointment belum tiba."
            )

        booking.status = status_val
        db.commit()
        db.refresh(booking)
        return booking

    @staticmethod
    def delete_booking(db: Session, booking_id: int, current_user: User):
        booking = db.query(Booking).filter(Booking.id == booking_id).first()
        if not booking:
            raise HTTPException(status_code=404, detail="Booking tidak ditemukan")
        
        salon = db.query(Salon).filter(Salon.id == booking.salon_id).first()
        if (
            booking.user_id != current_user.id 
            and (not salon or salon.owner_id != current_user.id) 
            and current_user.role != "admin"
        ):
            raise HTTPException(status_code=403, detail="Akses ditolak")
        
        db.query(BookingService).filter(BookingService.booking_id == booking_id).delete()
        db.query(Payment).filter(Payment.booking_id == booking_id).delete()
        db.delete(booking)
        db.commit()
