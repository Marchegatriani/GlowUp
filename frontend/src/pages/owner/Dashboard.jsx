import { useState } from "react";
import Sidebar from "@/components/Sidebar";

/* ── Analytics card data ── */
const analyticsCards = [
  {
    icon: (
      <svg width="47" height="54" viewBox="0 0 47 54" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="47" height="54" rx="20" fill="#F8C8DC" fillOpacity="0.4" />
        <path d="M18 38C17.45 38 16.9792 37.8042 16.5875 37.4125C16.1958 37.0208 16 36.55 16 36V18C16 17.45 16.1958 16.9792 16.5875 16.5875C16.9792 16.1958 17.45 16 18 16H28C28.55 16 29.0208 16.1958 29.4125 16.5875C29.8042 16.9792 30 17.45 30 18V21.1C30.3 21.2167 30.5417 21.4 30.725 21.65C30.9083 21.9 31 22.1833 31 22.5V24.5C31 24.8167 30.9083 25.1 30.725 25.35C30.5417 25.6 30.3 25.7833 30 25.9V36C30 36.55 29.8042 37.0208 29.4125 37.4125C29.0208 37.8042 28.55 38 28 38H18ZM20 31H26C26.2833 31 26.5208 30.9042 26.7125 30.7125C26.9042 30.5208 27 30.2833 27 30V28C26.7167 28 26.4792 27.9042 26.2875 27.7125C26.0958 27.5208 26 27.2833 26 27C26 26.7167 26.0958 26.4792 26.2875 26.2875C26.4792 26.0958 26.7167 26 27 26V24C27 23.7167 26.9042 23.4792 26.7125 23.2875C26.5208 23.0958 26.2833 23 26 23H20C19.7167 23 19.4792 23.0958 19.2875 23.2875C19.0958 23.4792 19 23.7167 19 24V26C19.2833 26 19.5208 26.0958 19.7125 26.2875C19.9042 26.4792 20 26.7167 20 27C20 27.2833 19.9042 27.5208 19.7125 27.7125C19.5208 27.9042 19.2833 28 19 28V30C19 30.2833 19.0958 30.5208 19.2875 30.7125C19.4792 30.9042 19.7167 31 20 31Z" fill="#795465" />
      </svg>
    ),
    badge: { text: "+12%", positive: true },
    label: "TOTAL BOOKING",
    value: "148",
    subValue: null,
  },
  {
    icon: (
      <svg width="54" height="48" viewBox="0 0 54 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="54" height="48" rx="20" fill="#E1D695" fillOpacity="0.4" />
        <path d="M18 32C17.45 32 16.9792 31.8042 16.5875 31.4125C16.1958 31.0208 16 30.55 16 30V19H18V30H35V32H18ZM22 28C21.45 28 20.9792 27.8042 20.5875 27.4125C20.1958 27.0208 20 26.55 20 26V18C20 17.45 20.1958 16.9792 20.5875 16.5875C20.9792 16.1958 21.45 16 22 16H36C36.55 16 37.0208 16.1958 37.4125 16.5875C37.8042 16.9792 38 17.45 38 18V26C38 26.55 37.8042 27.0208 37.4125 27.4125C37.0208 27.8042 36.55 28 36 28H22ZM24 26C24 25.45 23.8042 24.9792 23.4125 24.5875C23.0208 24.1958 22.55 24 22 24V26H24ZM34 26H36V24C35.45 24 34.9792 24.1958 34.5875 24.5875C34.1958 24.9792 34 25.45 34 26ZM29 25C29.8333 25 30.5417 24.7083 31.125 24.125C31.7083 23.5417 32 22.8333 32 22C32 21.1667 31.7083 20.4583 31.125 19.875C30.5417 19.2917 29.8333 19 29 19C28.1667 19 27.4583 19.2917 26.875 19.875C26.2917 20.4583 26 21.1667 26 22C26 22.8333 26.2917 23.5417 26.875 24.125C27.4583 24.7083 28.1667 25 29 25ZM22 20C22.55 20 23.0208 19.8042 23.4125 19.4125C23.8042 19.0208 24 18.55 24 18H22V20ZM36 20V18H34C34 18.55 34.1958 19.0208 34.5875 19.4125C34.9792 19.8042 35.45 20 36 20Z" fill="#675F2B" />
      </svg>
    ),
    badge: { text: "+8.4%", positive: true },
    label: "TOTAL PENDAPATAN",
    value: "Rp 24,5Jt",
    subValue: null,
  },
  {
    icon: (
      <svg width="52" height="51" viewBox="0 0 52 51" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="52" height="51" rx="20" fill="#E1DFDB" fillOpacity="0.4" />
        <path d="M19.825 35L21.45 27.975L16 23.25L23.2 22.625L26 16L28.8 22.625L36 23.25L30.55 27.975L32.175 35L26 31.275L19.825 35Z" fill="#5E5F5B" />
      </svg>
    ),
    badge: { text: "Terbaik", positive: null },
    label: "RATING SALON",
    value: "4.9",
    subValue: "/ 5.0 (210 ulasan)",
  },
];

/* ── Bar chart data ── */
const barData = [
  { day: "Sen", value: 2100000, label: "Rp 2.1jt", height: 40 },
  { day: "Sel", value: 3400000, label: "Rp 3.4jt", height: 65 },
  { day: "Rab", value: 2900000, label: "Rp 2.9jt", height: 56, active: true },
  { day: "Kam", value: 4500000, label: "Rp 4.5jt", height: 87 },
  { day: "Jum", value: 2400000, label: "Rp 2.4jt", height: 46 },
  { day: "Sab", value: 3800000, label: "Rp 3.8jt", height: 73 },
  { day: "Min", value: 5200000, label: "Rp 5.2jt", height: 100 },
];

/* ── Popular services ── */
const popularServices = [
  {
    name: "Signature Balayage",
    bookings: "42 Booking bulan ini",
    price: "Rp 1.2jt",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/bd798f11415ca0348620620846272411656ea963?width=112",
  },
  {
    name: "Glow Facial Spa",
    bookings: "38 Booking bulan ini",
    price: "Rp 850rb",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/e9ba98a74c812c881c730d40773a4fe4f8991553?width=112",
  },
  {
    name: "Rose Gold Manicure",
    bookings: "31 Booking bulan ini",
    price: "Rp 450rb",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/e1a93b9e2078701bd27edb95b39aabe7fbd8869d?width=112",
  },
];

/* ── Recent bookings ── */
const bookings = [
  {
    initials: "SR",
    bgColor: "#F8C8DC",
    textColor: "#795465",
    name: "Siti Rahma",
    email: "siti.r@email.com",
    service: "Signature Balayage",
    date: "24 Okt 2024",
    time: "10:00 - 13:00",
    total: "Rp 1.250.000",
    status: "PENDING",
    statusBg: "#FEF9C3",
    statusText: "#854D0E",
    actions: "confirm-cancel",
  },
  {
    initials: "DL",
    bgColor: "#E1DFDB",
    textColor: "#5E5F5B",
    name: "Dewi Lestari",
    email: "dewi.l@email.com",
    service: "Glow Facial Spa",
    date: "24 Okt 2024",
    time: "14:00 - 15:30",
    total: "Rp 850.000",
    status: "DIPROSES",
    statusBg: "#DBEAFE",
    statusText: "#1E40AF",
    actions: "more",
  },
  {
    initials: "BK",
    bgColor: "#E1D695",
    textColor: "#675F2B",
    name: "Bella Karina",
    email: "bella@email.com",
    service: "Rose Gold Manicure",
    date: "24 Okt 2024",
    time: "09:00 - 10:30",
    total: "Rp 450.000",
    status: "SELESAI",
    statusBg: "#DCFCE7",
    statusText: "#166534",
    actions: "view",
  },
];

export default function Index() {
  const [selectedPeriod] = useState("7 Hari Terakhir");

  return (
    <div className="flex min-h-screen bg-[#FCF9F8] font-inter">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-[280px] min-h-screen">
        <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">

          {/* ── Header ── */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
                Ringkasan Bisnis
              </h1>
              <p className="text-[#5E5F5B] text-base font-normal leading-6">
                Selamat datang kembali, Amanda. Inilah performa salon Anda hari ini.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              {/* Date pill */}
              <div className="flex items-center gap-2 px-6 py-2 rounded-[20px] border border-[rgba(210,195,199,0.20)] bg-[rgba(255,255,255,0.85)] backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(121,84,101,0.12)]">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5Z" fill="#795465" />
                </svg>
                <span className="text-[#1B1C1C] font-semibold text-sm leading-5">24 Oktober 2024</span>
              </div>
              {/* Notification bell */}
              <button className="relative flex items-center justify-center w-9 h-9 rounded-xl border border-[rgba(210,195,199,0.30)] bg-[#F6F3F2]">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 17V15H2V8C2 6.61667 2.41667 5.3875 3.25 4.3125C4.08333 3.2375 5.16667 2.53333 6.5 2.2V1.5C6.5 1.08333 6.64583 0.729167 6.9375 0.4375C7.22917 0.145833 7.58333 0 8 0C8.41667 0 8.77083 0.145833 9.0625 0.4375C9.35417 0.729167 9.5 1.08333 9.5 1.5V2.2C10.8333 2.53333 11.9167 3.2375 12.75 4.3125C13.5833 5.3875 14 6.61667 14 8V15H16V17H0ZM8 20C7.45 20 6.97917 19.8042 6.5875 19.4125C6.19583 19.0208 6 18.55 6 18H10C10 18.55 9.80417 19.0208 9.4125 19.4125C9.02083 19.8042 8.55 20 8 20ZM4 15H12V8C12 6.9 11.6083 5.95833 10.825 5.175C10.0417 4.39167 9.1 4 8 4C6.9 4 5.95833 4.39167 5.175 5.175C4.39167 5.95833 4 6.9 4 8V15Z" fill="#4F4448" />
                </svg>
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#BA1A1A] ring-2 ring-[#FCF9F8]" />
              </button>
            </div>
          </header>

          {/* ── Analytics Cards ── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {analyticsCards.map((card, i) => (
              <div
                key={i}
                className="relative glass-card rounded-[20px] p-10 flex flex-col gap-1 overflow-hidden"
              >
                <div className="flex justify-between items-start">
                  {card.icon}
                  {card.badge.positive === true && (
                    <span className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#DCFCE7] text-[#15803D] font-bold text-xs leading-[18px]">
                      {card.badge.text}
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                        <path d="M4.08333 9.33333V2.23125L0.816667 5.49792L0 4.66667L4.66667 0L9.33333 4.66667L8.51667 5.49792L5.25 2.23125V9.33333H4.08333Z" fill="#15803D" />
                      </svg>
                    </span>
                  )}
                  {card.badge.positive === null && (
                    <span className="px-3 py-1 rounded-full bg-[rgba(121,84,101,0.10)] text-[#795465] font-bold text-xs leading-[18px]">
                      {card.badge.text}
                    </span>
                  )}
                </div>
                <p className="text-[rgba(94,95,91,0.60)] font-semibold text-[13px] leading-[19.5px] tracking-[0.65px] uppercase mt-3">
                  {card.label}
                </p>
                <div className="flex items-baseline gap-2">
                  <span className="text-[#1B1C1C] font-bold text-[36px] leading-[45px]">{card.value}</span>
                  {card.subValue && (
                    <span className="text-[rgba(94,95,91,0.50)] text-sm font-normal">{card.subValue}</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* ── Charts + Popular Services ── */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_316px] gap-6">

            {/* Revenue Chart */}
            <div className="glass-card rounded-[20px] p-10 flex flex-col gap-10">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Statistik Pendapatan</h2>
                  <p className="text-[rgba(94,95,91,0.60)] text-sm font-normal">Data mingguan terkini</p>
                </div>
                <div className="flex items-center gap-2 px-6 py-2 rounded-xl border border-[rgba(210,195,199,0.30)] bg-[#F6F3F2] cursor-pointer">
                  <span className="text-[#1B1C1C] font-semibold text-sm leading-5">{selectedPeriod}</span>
                  <svg width="16" height="16" viewBox="0 0 21 21" fill="none">
                    <path d="M6.3 8.4L10.5 12.6L14.7 8.4" stroke="#6B7280" strokeWidth="1.575" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>

              {/* Bar Chart */}
              <div className="flex items-end justify-between gap-2 h-[260px] relative">
                {/* Grid lines */}
                <div className="absolute inset-x-0 top-0 bottom-8 flex flex-col justify-between pointer-events-none">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-full border-t border-[rgba(210,195,199,0.15)]" />
                  ))}
                </div>

                {barData.map((bar, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 flex-1 h-full justify-end">
                    <div className="relative w-full flex flex-col items-center justify-end" style={{ height: "calc(100% - 32px)" }}>
                      {/* Tooltip */}
                      <div
                        className={`absolute top-0 left-1/2 -translate-x-1/2 px-2 py-1 rounded-lg text-white text-[11px] leading-[16.5px] shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10)] whitespace-nowrap z-10 ${
                          bar.active ? "bg-[#795465] font-bold" : "bg-[#1B1C1C] font-normal"
                        }`}
                        style={{ top: `calc(100% - ${bar.height}% - 36px)` }}
                      >
                        {bar.label}
                      </div>
                      {/* Bar */}
                      <div
                        className={`w-full max-w-[52px] rounded-t-xl transition-all ${
                          bar.active
                            ? "bg-[rgba(121,84,101,0.20)] border-t-4 border-[#795465]"
                            : "bg-[rgba(27,28,28,0.08)] hover:bg-[rgba(27,28,28,0.12)]"
                        }`}
                        style={{ height: `${bar.height}%` }}
                      />
                    </div>
                    {/* Day label */}
                    <span
                      className={`text-xs leading-[18px] font-medium ${
                        bar.active ? "text-[#795465] font-bold" : "text-[rgba(94,95,91,0.50)]"
                      }`}
                    >
                      {bar.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Services */}
            <div className="glass-card rounded-[20px] p-10 flex flex-col justify-between">
              <div className="flex flex-col gap-6">
                <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Layanan Terpopuler</h2>
                <div className="flex flex-col gap-10">
                  {popularServices.map((service, i) => (
                    <div key={i} className="flex items-center gap-4">
                      <img
                        src={service.img}
                        alt={service.name}
                        className="w-14 h-14 rounded-[20px] object-cover flex-shrink-0"
                      />
                      <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                        <span className="text-[#1B1C1C] font-bold text-sm leading-5 truncate">{service.name}</span>
                        <span className="text-[rgba(94,95,91,0.60)] text-xs font-normal leading-4">{service.bookings}</span>
                      </div>
                      <span className="text-[#795465] font-bold text-sm leading-5 flex-shrink-0">{service.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-10">
                <button className="w-full flex items-center justify-center gap-1 py-2 rounded-[20px] border-2 border-[rgba(121,84,101,0.10)] text-[#795465] font-bold text-sm leading-5 hover:bg-[rgba(121,84,101,0.05)] transition-colors">
                  Lihat Laporan Lengkap
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M9.13125 6.75H0V5.25H9.13125L4.93125 1.05L6 0L12 6L6 12L4.93125 10.95L9.13125 6.75Z" fill="#795465" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* ── Bookings Table ── */}
          <div className="glass-card rounded-[20px] overflow-hidden">
            {/* Table header */}
            <div className="flex justify-between items-center px-10 py-6 border-b border-[rgba(210,195,199,0.20)] bg-[rgba(246,243,242,0.30)]">
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Booking Terbaru</h2>
                <p className="text-[rgba(94,95,91,0.60)] text-xs font-normal leading-4">Status konfirmasi pelanggan hari ini</p>
              </div>
              <button className="text-[#795465] font-bold text-sm leading-5 hover:opacity-80 transition-opacity">
                Lihat Semua
              </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-[rgba(246,243,242,0.50)]">
                    <th className="px-10 py-8 text-left text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Pelanggan</th>
                    <th className="px-10 py-8 text-left text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Layanan</th>
                    <th className="px-10 py-6 text-left text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Waktu & Tanggal</th>
                    <th className="px-10 py-6 text-left text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Total Bayar</th>
                    <th className="px-10 py-8 text-left text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Status</th>
                    <th className="px-10 py-8 text-right text-[#5E5F5B] font-bold text-xs uppercase tracking-[1.2px]">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking, i) => (
                    <tr
                      key={i}
                      className={i > 0 ? "border-t border-[rgba(210,195,199,0.10)]" : ""}
                    >
                      {/* Customer */}
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] font-bold text-base"
                            style={{ backgroundColor: booking.bgColor, color: booking.textColor }}
                          >
                            {booking.initials}
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[#1B1C1C] font-bold text-sm leading-5">{booking.name}</span>
                            <span className="text-[rgba(94,95,91,0.60)] text-[11px] font-normal">{booking.email}</span>
                          </div>
                        </div>
                      </td>
                      {/* Service */}
                      <td className="px-10 py-6">
                        <span className="text-[#1B1C1C] font-medium text-sm leading-5">{booking.service}</span>
                      </td>
                      {/* Date/Time */}
                      <td className="px-10 py-6">
                        <div className="flex flex-col">
                          <span className="text-[#1B1C1C] font-bold text-sm leading-5">{booking.date}</span>
                          <span className="text-[rgba(94,95,91,0.60)] text-[11px] font-normal">{booking.time}</span>
                        </div>
                      </td>
                      {/* Total */}
                      <td className="px-10 py-6">
                        <span className="text-[#1B1C1C] font-bold text-sm leading-5">{booking.total}</span>
                      </td>
                      {/* Status */}
                      <td className="px-10 py-6">
                        <span
                          className="inline-flex px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[1px]"
                          style={{ backgroundColor: booking.statusBg, color: booking.statusText }}
                        >
                          {booking.status}
                        </span>
                      </td>
                      {/* Actions */}
                      <td className="px-10 py-6">
                        <div className="flex justify-end gap-2">
                          {booking.actions === "confirm-cancel" && (
                            <>
                              <button className="w-9 h-9 rounded-xl bg-[rgba(121,84,101,0.10)] flex items-center justify-center hover:bg-[rgba(121,84,101,0.18)] transition-colors">
                                <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                                  <path d="M4.275 9.01875L0 4.74375L1.06875 3.675L4.275 6.88125L11.1562 0L12.225 1.06875L4.275 9.01875Z" fill="#795465" />
                                </svg>
                              </button>
                              <button className="w-9 h-9 rounded-xl bg-[rgba(186,26,26,0.10)] flex items-center justify-center hover:bg-[rgba(186,26,26,0.18)] transition-colors">
                                <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
                                  <path d="M1.05 10.5L0 9.45L4.2 5.25L0 1.05L1.05 0L5.25 4.2L9.45 0L10.5 1.05L6.3 5.25L10.5 9.45L9.45 10.5L5.25 6.3L1.05 10.5Z" fill="#BA1A1A" />
                                </svg>
                              </button>
                            </>
                          )}
                          {booking.actions === "more" && (
                            <button className="w-9 h-9 rounded-xl bg-[rgba(94,95,91,0.10)] flex items-center justify-center hover:bg-[rgba(94,95,91,0.18)] transition-colors">
                              <svg width="12" height="3" viewBox="0 0 12 3" fill="none">
                                <path d="M1.5 3C1.0875 3 0.734375 2.85313 0.440625 2.55938C0.146875 2.26562 0 1.9125 0 1.5C0 1.0875 0.146875 0.734375 0.440625 0.440625C0.734375 0.146875 1.0875 0 1.5 0C1.9125 0 2.26562 0.146875 2.55938 0.440625C2.85313 0.734375 3 1.0875 3 1.5C3 1.9125 2.85313 2.26562 2.55938 2.55938C2.26562 2.85313 1.9125 3 1.5 3ZM6 3C5.5875 3 5.23438 2.85313 4.94063 2.55938C4.64688 2.26562 4.5 1.9125 4.5 1.5C4.5 1.0875 4.64688 0.734375 4.94063 0.440625C5.23438 0.146875 5.5875 0 6 0C6.4125 0 6.76562 0.146875 7.05937 0.440625C7.35312 0.734375 7.5 1.0875 7.5 1.5C7.5 1.9125 7.35312 2.26562 7.05937 2.55938C6.76562 2.85313 6.4125 3 6 3ZM10.5 3C10.0875 3 9.73438 2.85313 9.44063 2.55938C9.14688 2.26562 9 1.9125 9 1.5C9 1.0875 9.14688 0.734375 9.44063 0.440625C9.73438 0.146875 10.0875 0 10.5 0C10.9125 0 11.2656 0.146875 11.5594 0.440625C11.8531 0.734375 12 1.0875 12 1.5C12 1.9125 11.8531 2.26562 11.5594 2.55938C11.2656 2.85313 10.9125 3 10.5 3Z" fill="#5E5F5B" />
                              </svg>
                            </button>
                          )}
                          {booking.actions === "view" && (
                            <button className="w-9 h-9 rounded-xl bg-[rgba(248,200,220,0.20)] flex items-center justify-center hover:bg-[rgba(248,200,220,0.35)] transition-colors">
                              <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
                                <path d="M8.25 9C9.1875 9 9.98438 8.67188 10.6406 8.01562C11.2969 7.35938 11.625 6.5625 11.625 5.625C11.625 4.6875 11.2969 3.89062 10.6406 3.23438C9.98438 2.57812 9.1875 2.25 8.25 2.25C7.3125 2.25 6.51562 2.57812 5.85938 3.23438C5.20312 3.89062 4.875 4.6875 4.875 5.625C4.875 6.5625 5.20312 7.35938 5.85938 8.01562C6.51562 8.67188 7.3125 9 8.25 9ZM8.25 7.65C7.6875 7.65 7.20938 7.45312 6.81563 7.05937C6.42188 6.66562 6.225 6.1875 6.225 5.625C6.225 5.0625 6.42188 4.58438 6.81563 4.19063C7.20938 3.79688 7.6875 3.6 8.25 3.6C8.8125 3.6 9.29062 3.79688 9.68437 4.19063C10.0781 4.58438 10.275 5.0625 10.275 5.625C10.275 6.1875 10.0781 6.66562 9.68437 7.05937C9.29062 7.45312 8.8125 7.65 8.25 7.65ZM8.25 11.25C6.425 11.25 4.7625 10.7406 3.2625 9.72188C1.7625 8.70312 0.675 7.3375 0 5.625C0.675 3.9125 1.7625 2.54688 3.2625 1.52813C4.7625 0.509375 6.425 0 8.25 0C10.075 0 11.7375 0.509375 13.2375 1.52813C14.7375 2.54688 15.825 3.9125 16.5 5.625C15.825 7.3375 14.7375 8.70312 13.2375 9.72188C11.7375 10.7406 10.075 11.25 8.25 11.25Z" fill="#795465" />
                              </svg>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}