import { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

const HelpIcon = () => (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.29167 13.3333C8.58333 13.3333 8.82986 13.2326 9.03125 13.0312C9.23264 12.8299 9.33333 12.5833 9.33333 12.2917C9.33333 12 9.23264 11.7535 9.03125 11.5521C8.82986 11.3507 8.58333 11.25 8.29167 11.25C8 11.25 7.75347 11.3507 7.55208 11.5521C7.35069 11.7535 7.25 12 7.25 12.2917C7.25 12.5833 7.35069 12.8299 7.55208 13.0312C7.75347 13.2326 8 13.3333 8.29167 13.3333ZM7.54167 10.125H9.08333C9.08333 9.66667 9.13542 9.30556 9.23958 9.04167C9.34375 8.77778 9.63889 8.41667 10.125 7.95833C10.4861 7.59722 10.7708 7.25347 10.9792 6.92708C11.1875 6.60069 11.2917 6.20833 11.2917 5.75C11.2917 4.97222 11.0069 4.375 10.4375 3.95833C9.86806 3.54167 9.19444 3.33333 8.41667 3.33333C7.625 3.33333 6.98264 3.54167 6.48958 3.95833C5.99653 4.375 5.65278 4.875 5.45833 5.45833L6.83333 6C6.90278 5.75 7.05903 5.47917 7.30208 5.1875C7.54514 4.89583 7.91667 4.75 8.41667 4.75C8.86111 4.75 9.19444 4.87153 9.41667 5.11458C9.63889 5.35764 9.75 5.625 9.75 5.91667C9.75 6.19444 9.66667 6.45486 9.5 6.69792C9.33333 6.94097 9.125 7.16667 8.875 7.375C8.26389 7.91667 7.88889 8.32639 7.75 8.60417C7.61111 8.88194 7.54167 9.38889 7.54167 10.125ZM8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667Z" fill="#6B7280"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H7.5V1.66667H1.66667V13.3333H7.5V15H1.66667ZM10.8333 11.6667L9.6875 10.4583L11.8125 8.33333H5V6.66667H11.8125L9.6875 4.54167L10.8333 3.33333L15 7.5L10.8333 11.6667Z" fill="#EF4444"/>
  </svg>
);

const StarIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.1375 11.1187L7.5 9.69375L9.8625 11.1375L9.24375 8.4375L11.325 6.6375L8.5875 6.39375L7.5 3.84375L6.4125 6.375L3.675 6.61875L5.75625 8.4375L5.1375 11.1187ZM2.86875 14.25L4.0875 8.98125L0 5.4375L5.4 4.96875L7.5 0L9.6 4.96875L15 5.4375L10.9125 8.98125L12.1313 14.25L7.5 11.4563L2.86875 14.25Z" fill="#EAB308"/>
  </svg>
);

const timeSlots = [
  { time: "10:00", available: true },
  { time: "13:30", available: true },
  { time: "15:00", available: true },
  { time: "16:30", available: true },
  { time: "18:00", available: true },
  { time: "20:00", available: false },
];

export default function Detail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // States for Booking
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [isServiceOpen, setIsServiceOpen] = useState(false);
  const [isBooking, setIsBooking] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSalonDetail = async () => {
      try {
        const response = await axiosClient.get(`/salons/${id}`);
        setSalon(response.data);
        
        // Fetch services
        const servicesResponse = await axiosClient.get(`/salons/${id}/services`);
        setServices(servicesResponse.data);
        if (servicesResponse.data.length > 0) {
          setSelectedService(servicesResponse.data[0]);
        }
      } catch (error) {
        console.error("Gagal memuat detail salon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalonDetail();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const getTodayDateString = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const handleBooking = async () => {
    if (!selectedService || !selectedDate || !selectedTime) {
      setError("Pilih layanan, tanggal, dan waktu terlebih dahulu.");
      return;
    }

    const todayStr = getTodayDateString();
    if (selectedDate < todayStr) {
      setError("Tanggal booking tidak boleh di masa lalu.");
      return;
    }

    try {
      setIsBooking(true);
      setError(null);
      // Format as local time string to prevent UTC conversion on backend
      const localBookingTime = `${selectedDate}T${selectedTime}:00`;

      const response = await axiosClient.post("/bookings/", {
        salon_id: parseInt(id),
        booking_time: localBookingTime,
        service_ids: [selectedService.id]
      });

      console.log("Booking berhasil", response.data);
      // Navigate to payment or detail
      navigate(`/user/pembayaran/${response.data.id}`);
    } catch (err) {
      console.error("Booking gagal", err);
      setError(err.response?.data?.detail || "Gagal melakukan booking. Silakan coba lagi.");
    } finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Memuat detail salon...</p>
      </div>
    );
  }

  if (!salon) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <p className="text-gray-500 font-medium">Salon tidak ditemukan.</p>
        <Link to="/user/jelajah" className="text-[#8B6B7A] hover:underline">Kembali ke Jelajah</Link>
      </div>
    );
  }

  return (
    <>
      {/* Main Content */}
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-10 grid grid-cols-1 lg:grid-cols-12 gap-10">

        {/* Left Content Column */}
        <div className="lg:col-span-8 flex flex-col gap-10">

          {/* Photo Gallery */}
          <div className="grid grid-cols-4 grid-rows-2 gap-3 sm:gap-4 h-[220px] sm:h-[360px] lg:h-[480px]">
            <div className="col-span-2 row-span-2 rounded-[24px] overflow-hidden shadow-sm">
              <img
                src={salon.image_url || (salon.id % 2 === 0 ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" : "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80")}
                alt={salon.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-2 row-span-1 rounded-[24px] overflow-hidden shadow-sm">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/f522a522b78a02f7f219e665307f41b3cc812db9?width=739"
                alt="Salon products"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 rounded-[24px] overflow-hidden shadow-sm">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/424d3877fb119231d00f071b20fd5b01c2ece842?width=353"
                alt="Treatment"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 rounded-[24px] overflow-hidden shadow-sm relative">
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/945999b432db93751ee3ff8fc7d5b006b7b6119d?width=353"
                alt="More photos"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <span className="text-white text-lg font-bold leading-7">+12</span>
                <span className="text-white/90 text-xs font-medium hidden sm:block">Foto Lainnya</span>
              </div>
            </div>
          </div>

          {/* Salon Info */}
          <div className="flex flex-col gap-6 bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="text-[28px] sm:text-[32px] font-bold text-gray-800 leading-tight">
                  {salon.name}
                </h1>
                <div className="flex items-center gap-2">
                  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
                    <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#8B6B7A"/>
                  </svg>
                  <span className="text-gray-500 text-base font-medium">{salon.address || "Lokasi belum tersedia"}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-semibold text-gray-700">Jam Operasional:</span>
                  <span className="text-sm text-gray-500">{salon.open_time} - {salon.close_time}</span>
                </div>
                {salon.phone_number && (
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-sm font-semibold text-gray-700">Kontak:</span>
                     <span className="text-sm text-gray-500">{salon.phone_number}</span>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-start sm:items-end gap-2 shrink-0">
                <div className="flex items-center gap-2 px-6 py-2 rounded-xl bg-yellow-50 border border-yellow-100">
                  <StarIcon />
                  <span className="text-yellow-700 text-lg font-bold">4.8</span>
                  <span className="text-yellow-600/80 text-sm">(124 Review)</span>
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-100 my-2" />

            <p className="text-gray-600 text-lg font-light leading-relaxed">
              {salon.description || "Salon ini belum memiliki deskripsi."}
            </p>
          </div>

          {/* Services Section */}
          <div className="flex flex-col gap-6 bg-white p-8 rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <h2 className="text-2xl font-bold text-gray-800">Daftar Layanan</h2>
            <div className="flex flex-col gap-4">
              {services.length === 0 ? (
                <p className="text-gray-500">Belum ada layanan untuk salon ini.</p>
              ) : (
                services.map((svc, i) => (
                  <div
                    key={svc.id}
                    className={`flex flex-col md:flex-row md:items-center justify-between gap-4 py-4 ${
                      i > 0 ? "border-t border-gray-100" : ""
                    }`}
                  >
                    <div className="flex flex-col gap-1 md:w-1/2">
                      <h4 className="text-gray-800 text-lg font-bold">{svc.name}</h4>
                      <p className="text-gray-500 text-sm">{svc.description || "Tidak ada deskripsi"}</p>
                    </div>
                    <div className="flex items-center justify-between md:w-1/2 md:justify-end gap-6">
                      <span className="px-4 py-1 rounded-full bg-gray-50 text-gray-600 text-sm font-medium">
                        {svc.duration_minutes} Menit
                      </span>
                      <span className="text-[#8B6B7A] text-lg font-bold">Rp {svc.price.toLocaleString("id-ID")}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-28 rounded-[24px] border border-gray-100 bg-white p-8 flex flex-col gap-8 shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)]">
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold text-gray-800">Reservasi Sekarang</h3>
              <p className="text-gray-500 text-sm">Pilih waktu dan layanan untuk transformasi Anda</p>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-6">
              {/* Service Selector */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">PILIH LAYANAN</label>
                <div className="relative">
                  <button
                    onClick={() => setIsServiceOpen(!isServiceOpen)}
                    disabled={services.length === 0}
                    className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-colors ${services.length === 0 ? "bg-gray-100 cursor-not-allowed border-gray-200" : "bg-gray-50 hover:bg-gray-100 border-gray-200"}`}
                  >
                    <span className="text-gray-800 text-base font-medium truncate pr-2">
                      {selectedService ? selectedService.name : "Tidak ada layanan"}
                    </span>
                    <svg width="12" height="8" viewBox="0 0 12 8" fill="none" className="shrink-0">
                      <path d="M6 7.4L0 1.4L1.4 0L6 4.6L10.6 0L12 1.4L6 7.4Z" fill="#6B7280"/>
                    </svg>
                  </button>
                  {isServiceOpen && services.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 rounded-xl border border-gray-100 bg-white shadow-xl z-20 overflow-hidden max-h-60 overflow-y-auto">
                      {services.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => { setSelectedService(s); setIsServiceOpen(false); }}
                          className={`w-full text-left px-4 py-3 text-sm transition-colors hover:bg-gray-50 ${
                            selectedService?.id === s.id ? "text-[#8B6B7A] font-bold bg-pink-50/30" : "text-gray-700"
                          }`}
                        >
                          {s.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Date */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">TANGGAL</label>
                <input 
                  type="date" 
                  value={selectedDate}
                  min={getTodayDateString()}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 font-medium focus:outline-none focus:ring-2 focus:ring-[#8B6B7A]"
                />
              </div>

              {/* Time Slots */}
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-sm font-bold">WAKTU</label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      key={slot.time}
                      disabled={!slot.available}
                      onClick={() => slot.available && setSelectedTime(slot.time)}
                      className={`py-2.5 rounded-xl text-sm font-medium text-center transition-all ${
                        !slot.available
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : selectedTime === slot.time
                          ? "bg-[#8B6B7A] text-white shadow-md"
                          : "border border-gray-200 bg-white text-gray-700 hover:border-[#8B6B7A] hover:text-[#8B6B7A]"
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Price Summary */}
            <div className="flex flex-col gap-3 p-5 rounded-xl bg-gray-50 border border-gray-100">
              <div className="flex justify-between items-center">
                <span className="text-gray-800 text-base font-bold">Total</span>
                <span className="text-[#8B6B7A] text-lg font-bold">
                  {selectedService ? `Rp ${selectedService.price.toLocaleString("id-ID")}` : "Rp 0"}
                </span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleBooking}
              disabled={isBooking || services.length === 0}
              className={`w-full py-4 rounded-xl text-white text-base font-bold tracking-wide transition-all shadow-md ${
                isBooking || services.length === 0 ? "opacity-70 cursor-not-allowed" : "hover:shadow-lg hover:-translate-y-0.5"
              }`}
              style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
            >
              {isBooking ? "Memproses..." : "Konfirmasi Booking"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
