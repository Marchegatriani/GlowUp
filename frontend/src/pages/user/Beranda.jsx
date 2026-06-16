import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

// SVG Icons
const CalendarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 7V3M16 7V3M7 11H17M5 21H19C20.1038 21 21 20.1038 21 19V7C21 5.89617 20.1038 5 19 5H5C3.89617 5 3 5.89617 3 7V19C3 20.1038 3.89617 21 5 21L8 7" stroke="#F472B6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const StarIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="#EAB308"/>
  </svg>
);

const MessageIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 8H17M7 12H11M12 20L8 16H5C3.89617 16 3 15.1038 3 14V6C3 4.89617 3.89617 4 5 4H19C20.1038 4 21 4.89617 21 6V14C21 15.1038 20.1038 16 19 16H16L12 20L7 8" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.3333 5.33331L14 7.99998M14 7.99998L11.3333 10.6666M14 7.99998H2" stroke="#4B5563" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SmallCalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M4.66667 4.08333V1.75M9.33333 4.08333V1.75M4.08333 6.41667H9.91667M2.91667 12.25H11.0833C11.7272 12.25 12.25 11.7272 12.25 11.0833V4.08333C12.25 3.43943 11.7272 2.91667 11.0833 2.91667H2.91667C2.27277 2.91667 1.75 3.43943 1.75 4.08333V11.0833C1.75 11.7272 2.27277 12.25 2.91667 12.25L4.66667 4.08333" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SmallClockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7 4.66667V7L8.75 8.75M12.25 7C12.25 9.89755 9.89755 12.25 7 12.25C4.10245 12.25 1.75 9.89755 1.75 7C1.75 4.10245 4.10245 1.75 7 1.75C9.89755 1.75 12.25 4.10245 12.25 7L7 4.66667" stroke="#6B7280" strokeWidth="1.16667" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 2.66667C2 2.29872 2.29872 2 2.66667 2H13.3333C13.7013 2 14 2.29872 14 2.66667V4.39067C14 4.56746 13.9297 4.737 13.8047 4.862L9.52867 9.138C9.40363 9.263 9.33337 9.43254 9.33333 9.60933V11.3333L6.66667 14V9.60933C6.66663 9.43254 6.59637 9.263 6.47133 9.138L2.19533 4.862C2.0703 4.737 2.00004 4.56746 2 4.39067V2.66667V2.66667" stroke="#1F2937" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const ReportIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.00016 11.3333V10M8.00016 11.3333V8.66667M10.0002 11.3333V7.33333M11.3335 14H4.66683C3.93094 14 3.3335 13.4026 3.3335 12.6667V3.33333C3.3335 2.59745 3.93094 2 4.66683 2H8.39083C8.56763 2.00004 8.73717 2.0703 8.86216 2.19533L12.4715 5.80467C12.5965 5.92966 12.6668 6.0992 12.6668 6.276V12.6667C12.6668 13.4026 12.0694 14 11.3335 14L6.00016 11.3333" stroke="#1F2937" strokeWidth="1.33333" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const HelpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.29167 13.3333C8.58333 13.3333 8.82986 13.2326 9.03125 13.0312C9.23264 12.8299 9.33333 12.5833 9.33333 12.2917C9.33333 12 9.23264 11.7535 9.03125 11.5521C8.82986 11.3507 8.58333 11.25 8.29167 11.25C8 11.25 7.75347 11.3507 7.55208 11.5521C7.35069 11.7535 7.25 12 7.25 12.2917C7.25 12.5833 7.35069 12.8299 7.55208 13.0312C7.75347 13.2326 8 13.3333 8.29167 13.3333ZM7.54167 10.125H9.08333C9.08333 9.66667 9.13542 9.30556 9.23958 9.04167C9.34375 8.77778 9.63889 8.41667 10.125 7.95833C10.4861 7.59722 10.7708 7.25347 10.9792 6.92708C11.1875 6.60069 11.2917 6.20833 11.2917 5.75C11.2917 4.97222 11.0069 4.375 10.4375 3.95833C9.86806 3.54167 9.19444 3.33333 8.41667 3.33333C7.625 3.33333 6.98264 3.54167 6.48958 3.95833C5.99653 4.375 5.65278 4.875 5.45833 5.45833L6.83333 6C6.90278 5.75 7.05903 5.47917 7.30208 5.1875C7.54514 4.89583 7.91667 4.75 8.41667 4.75C8.86111 4.75 9.19444 4.87153 9.41667 5.11458C9.63889 5.35764 9.75 5.625 9.75 5.91667C9.75 6.19444 9.66667 6.45486 9.5 6.69792C9.33333 6.94097 9.125 7.16667 8.875 7.375C8.26389 7.91667 7.88889 8.32639 7.75 8.60417C7.61111 8.88194 7.54167 9.38889 7.54167 10.125ZM8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667ZM8.33333 15C10.1944 15 11.7708 14.3542 13.0625 13.0625C14.3542 11.7708 15 10.1944 15 8.33333C15 6.47222 14.3542 4.89583 13.0625 3.60417C11.7708 2.3125 10.1944 1.66667 8.33333 1.66667C6.47222 1.66667 4.89583 2.3125 3.60417 3.60417C2.3125 4.89583 1.66667 6.47222 1.66667 8.33333C1.66667 10.1944 2.3125 11.7708 3.60417 13.0625C4.89583 14.3542 6.47222 15 8.33333 15Z" fill="#4B5563"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H7.5V1.66667H1.66667V13.3333H7.5V15H1.66667ZM10.8333 11.6667L9.6875 10.4583L11.8125 8.33333H5V6.66667H11.8125L9.6875 4.54167L10.8333 3.33333L15 7.5L10.8333 11.6667Z" fill="#EF4444"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="8" height="9" viewBox="0 0 8 9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M7.79883 0.240234C5.88867 2.9668 3.92578 5.49023 1.91016 7.81055C1.75781 7.98633 1.625 8.07422 1.51172 8.07422C1.38281 8.07422 1.15039 7.73438 0.814453 7.05469C0.271484 5.95703 0 5.30078 0 5.08594C0 5.00781 0.0527344 4.91602 0.158203 4.81055C0.384766 4.57227 0.544922 4.45312 0.638672 4.45312C0.724609 4.45312 0.816406 4.58984 0.914062 4.86328C1.17188 5.55859 1.44336 6.17773 1.72852 6.7207C3.70508 4.7207 5.66016 2.48047 7.59375 0L7.79883 0.240234Z" fill="white"/>
  </svg>
);

const DotsIcon = () => (
  <svg width="10" height="2" viewBox="0 0 10 2" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.248 0V1.248H0V0H1.248ZM9.24 0V1.248H7.992V0H9.24ZM5.22 0V1.248H3.972V0H5.22Z" fill="white"/>
  </svg>
);

export default function Index() {
  const [userData, setUserData] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [dashboardRes, bookingsRes] = await Promise.all([
          axiosClient.get("/customer/dashboard"),
          axiosClient.get("/bookings/me")
        ]);
        setUserData(dashboardRes.data);
        setBookings(bookingsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
        // Jika token tidak valid / unauthorized
        if (error.response?.status === 401) {
          localStorage.removeItem("access_token");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [navigate]);

  const getStatusStyle = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-50 text-yellow-600";
      case "confirmed": return "bg-blue-50 text-blue-600";
      case "completed": return "bg-green-50 text-green-600";
      case "cancelled": return "bg-red-50 text-red-500";
      default: return "bg-gray-50 text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "MENUNGGU PEMBAYARAN";
      case "confirmed": return "DIKONFIRMASI";
      case "completed": return "SELESAI";
      case "cancelled": return "DIBATALKAN";
      default: return status.toUpperCase();
    }
  };

  const upcomingBookings = bookings
    .filter((b) => {
      const status = b.status?.toLowerCase();
      return (status === "pending" || status === "confirmed") && new Date(b.booking_time) >= new Date();
    })
    .sort((a, b) => new Date(a.booking_time) - new Date(b.booking_time))
    .slice(0, 2);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-gray-500 font-medium">Memuat data dashboard...</p>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-12 py-12 flex flex-col gap-10">

        {/* Hero Banner */}
        <section className="rounded-3xl overflow-hidden">
          <div
            className="px-8 sm:px-16 py-16 sm:py-0 sm:h-80 flex flex-col justify-center items-start"
            style={{
              background: "linear-gradient(0deg, rgba(0,0,0,0.10) 0%, rgba(0,0,0,0.10) 100%), linear-gradient(90deg, #F5E0C7 0%, #F3D4D0 100%)",
            }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold text-black leading-tight mb-4">
              Halo, {userData?.user_info?.name || "User"}!
            </h1>
            <p className="text-base sm:text-lg text-black font-normal leading-relaxed mb-8 max-w-md">
              Selamat datang kembali di GlowUp. Waktunya untuk memanjakan diri Anda dengan layanan terbaik kami hari ini.
            </p>
            <Link to="/user/jelajah"
              className="px-8 py-3 rounded-xl text-base font-bold text-gray-800 shadow-md hover:opacity-90 transition-opacity inline-block"
              style={{
                background: "linear-gradient(102deg, #F2D2D2 0%, #F7E6C4 100%)",
              }}
            >
              Reservasi Sekarang
            </Link>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Booking Aktif */}
          <div className="bg-white rounded-2xl border border-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-[#FDF2F8] flex items-center justify-center mb-4">
              <CalendarIcon />
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">Booking Aktif</p>
            <p className="text-4xl font-bold text-gray-800">{userData?.stats?.active_bookings_count || 0}</p>
          </div>

          {/* Total Salon Favorit (Dummy for now) */}
          <div className="bg-white rounded-2xl border border-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-[#FEFCE8] flex items-center justify-center mb-4">
              <StarIcon />
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">Total Salon Favorit</p>
            <p className="text-4xl font-bold text-gray-800">12</p>
          </div>

          {/* Review Terkirim */}
          <div className="bg-white rounded-2xl border border-gray-50 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 flex flex-col items-center">
            <div className="w-12 h-12 rounded-lg bg-gray-50 flex items-center justify-center mb-4">
              <MessageIcon />
            </div>
            <p className="text-sm font-medium text-gray-400 mb-1">Review Terkirim</p>
            <p className="text-4xl font-bold text-gray-800">{userData?.stats?.total_reviews_given || 0}</p>
          </div>
        </section>

        {/* Upcoming Bookings */}
        <section className="flex flex-col gap-6 pt-2">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-7">Booking Mendatang</h2>
              <p className="text-sm text-gray-500 leading-5">Layanan yang akan segera datang untuk Anda</p>
            </div>
            <Link to="/user/riwayat-booking" className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors">
              Lihat Semua
              <ArrowRightIcon />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {upcomingBookings.length === 0 ? (
              <div className="col-span-1 md:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-8 text-center flex flex-col items-center justify-center min-h-[162px]">
                <p className="text-gray-500 font-medium mb-2">Belum ada booking mendatang.</p>
                <Link to="/user/jelajah" className="text-sm font-bold text-[#8B6B7A] hover:underline">
                  Cari Salon & Reservasi Sekarang
                </Link>
              </div>
            ) : (
              upcomingBookings.map((b) => {
                const isConfirmed = b.status?.toLowerCase() === "confirmed";
                const servicesText = b.services?.map(s => s.salon_service?.service?.name).join(", ") || "Layanan Salon";
                
                return (
                  <Link
                    key={b.id}
                    to={`/user/detail-booking/${b.id}`}
                    className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-4 flex items-center gap-6 min-h-[162px] hover:translate-y-[-2px] transition-transform select-none"
                  >
                    <div className="relative flex-shrink-0 w-32 h-32">
                      <img
                        src={`https://api.builder.io/api/v1/image/assets/TEMP/${b.salon_id % 2 === 0 ? "4295490d2b008bb111491f419e44fca5db04c803" : "f522a522b78a02f7f219e665307f41b3cc812db9"}?width=256`}
                        alt={b.salon?.name || "Salon"}
                        className="w-full h-full object-cover rounded-xl"
                      />
                      <div
                        className={`absolute -right-2 -top-2 w-6 h-6 rounded-full flex items-center justify-center shadow-md ${
                          isConfirmed ? "bg-[#8B6B7A]" : "bg-yellow-500"
                        }`}
                      >
                        {isConfirmed ? <CheckIcon /> : <DotsIcon />}
                      </div>
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h3 className="text-lg font-bold text-gray-800 leading-7 truncate">
                          {b.salon?.name || `Salon #${b.salon_id}`}
                        </h3>
                        <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase ${
                          isConfirmed ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600"
                        }`}>
                          {isConfirmed ? "Dikonfirmasi" : "Menunggu"}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 leading-5 mb-4 truncate">{servicesText}</p>
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-1">
                          <SmallCalendarIcon />
                          <span className="text-xs text-gray-500">
                            {new Date(b.booking_time).toLocaleString("id-ID", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <SmallClockIcon />
                          <span className="text-xs text-gray-500">
                            {new Date(b.booking_time).toLocaleString("id-ID", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })} WIB
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            )}
          </div>
        </section>

        {/* Booking History */}
        <section className="flex flex-col gap-6 pt-2">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-gray-800 leading-7">Riwayat Booking</h2>
              <p className="text-sm text-gray-500 leading-5">Daftar layanan yang telah Anda selesaikan</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <FilterIcon />
                Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-800 hover:bg-gray-50 transition-colors">
                <ReportIcon />
                Laporan
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-50">
                    <th className="text-left text-xs font-bold text-gray-400 px-8 py-5">Layanan</th>
                    <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Salon</th>
                    <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Tanggal</th>
                    <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Harga</th>
                    <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Status</th>
                    <th className="text-right text-xs font-bold text-gray-400 px-6 py-5">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500 text-sm">Belum ada riwayat reservasi</td>
                    </tr>
                  ) : (
                    bookings.map((row, idx) => (
                      <tr key={row.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                        <td className="px-8 py-6 text-sm font-bold text-gray-700 whitespace-nowrap">
                          Booking #{row.id}
                        </td>
                        <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">ID Salon: {row.salon_id}</td>
                        <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">
                          {new Date(row.booking_time).toLocaleString("id-ID", { dateStyle: "medium" })}
                        </td>
                        <td className="px-6 py-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                          Rp {row.total_price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-6 py-6">
                          <span
                            className={`inline-flex px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(row.status)}`}
                          >
                            {getStatusText(row.status)}
                          </span>
                        </td>
                        <td className="px-6 py-6 text-right">
                          <Link to={`/user/detail-booking/${row.id}`} className="text-sm font-bold text-[#8B6B7A] hover:underline">
                            Detail
                          </Link>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
