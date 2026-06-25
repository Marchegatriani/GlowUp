from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime
from app.schemas.user import UserResponse
from app.schemas.salon import SalonResponse
from app.schemas.booking import BookingResponse
from app.schemas.payment import PaymentResponse
from app.schemas.review import ReviewResponse


# =====================================================================
# A. SCHEMAS RESPONSE UNTUK ENDPOINT DASHBOARD AKTIF (FRONTEND UI)
# =====================================================================

# 1. Dashboard Customer (/customer/dashboard)
class CustomerUserInfo(BaseModel):
    name: str
    email: str

class CustomerDashboardStats(BaseModel):
    active_bookings_count: int = 0
    total_reviews_given: int = 0

class CustomerDashboardResponse(BaseModel):
    """Schema Response untuk Dashboard Customer/User"""
    message: str
    user_info: CustomerUserInfo
    stats: CustomerDashboardStats

    class Config:
        from_attributes = True


# 2. Dashboard Owner (/owner/dashboard)
class OwnerDashboardStats(BaseModel):
    total_bookings: int = 0
    total_revenue: str = "Rp 0"
    avg_rating: float = 0.0
    review_count: int = 0

class OwnerRecentBookingItem(BaseModel):
    id: int
    name: str
    email: str
    service: str
    date: str
    time: str
    total: str
    status: str

class WeeklyRevenueItem(BaseModel):
    day: str
    value: int
    label: str
    height: int

class PopularServiceItem(BaseModel):
    name: str
    bookings: str
    price: str
    img: str

class OwnerDashboardResponse(BaseModel):
    """Schema Response untuk Dashboard Owner Salon"""
    has_salon: bool
    message: Optional[str] = None
    salon_name: Optional[str] = None
    stats: OwnerDashboardStats
    recent_bookings: List[OwnerRecentBookingItem] = []
    weekly_revenue: List[WeeklyRevenueItem] = []
    popular_services: List[PopularServiceItem] = []

    class Config:
        from_attributes = True


# 3. Dashboard Admin (/admin/dashboard)
class AdminDashboardStats(BaseModel):
    total_users: int = 0
    total_customers: int = 0
    total_owners: int = 0
    total_salons: int = 0

class AdminDashboardResponse(BaseModel):
    """Schema Response untuk Dashboard Superadmin"""
    message: str
    admin_name: str
    stats: AdminDashboardStats

    class Config:
        from_attributes = True


# =====================================================================
# B. SCHEMAS ORM DETAIL (UNTUK PENGEMBANGAN FITUR LANJUTAN)
# =====================================================================

class ChartDataPoint(BaseModel):
    label: str
    value: float

class PopularServiceStat(BaseModel):
    service_id: int
    service_name: str
    salon_name: str
    booking_count: int = 0
    total_revenue: int = 0

class BookingStatusStat(BaseModel):
    status: str
    count: int = 0

class FullUserDashboardResponse(BaseModel):
    stats: CustomerDashboardStats
    upcoming_booking: Optional[BookingResponse] = None
    recent_bookings: List[BookingResponse] = []
    recent_reviews: List[ReviewResponse] = []

    class Config:
        from_attributes = True
