import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Index() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get("/owner/dashboard");
      setDashboardData(response.data);
    } catch (err) {
      console.error("Gagal mengambil data dashboard owner:", err);
      setError("Gagal memuat data dashboard.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#FEF9C3", text: "#854D0E", label: "MENUNGGU" };
      case "confirmed":
        return { bg: "#DBEAFE", text: "#1E40AF", label: "DIKONFIRMASI" };
      case "completed":
        return { bg: "#DCFCE7", text: "#166534", label: "SELESAI" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#991B1B", label: "DIBATALKAN" };
      default:
        return { bg: "#F3F4F6", text: "#374151", label: status?.toUpperCase() };
    }
  };

  const getInitials = (name) => {
    if (!name) return "P";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  if (loading) {
    return (
      <div className="flex min-h-screen bg-glowup-bg font-inter">
        <Sidebar />
        <main className="flex-1 ml-[280px] flex items-center justify-center">
          <p className="text-gray-500 font-medium">Memuat data ringkasan bisnis...</p>
        </main>
      </div>
    );
  }

  // If owner doesn't have a salon yet
  if (dashboardData && !dashboardData.has_salon) {
    return (
      <div className="flex min-h-screen bg-glowup-bg font-inter">
        <Sidebar />
        <main className="flex-1 ml-[280px] min-h-screen">
          <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
            <header className="flex flex-col gap-2">
              <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
                Ringkasan Bisnis
              </h1>
              <p className="text-[#5E5F5B] text-base font-normal leading-6">
                Selamat datang! Pendaftaran profil salon Anda diperlukan untuk mulai melacak performa.
              </p>
            </header>

            <div className="bg-white rounded-3xl border border-gray-100 p-12 text-center shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-pink-50 flex items-center justify-center text-glowup-brand">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="flex flex-col gap-2 max-w-md">
                <h3 className="text-xl font-bold text-gray-800">Profil Salon Belum Ditemukan</h3>
                <p className="text-sm text-gray-500 leading-relaxed">
                  Lengkapi data operasional salon Anda terlebih dahulu agar pelanggan dapat melakukan booking dan statistik penjualan dapat tercatat.
                </p>
              </div>
              <Link
                to="/owner/salon-profile"
                className="px-8 py-3.5 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all"
                style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
              >
                Mulai Isi Profil Salon
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stats = dashboardData?.stats;
  const recentBookings = dashboardData?.recent_bookings || [];
  const weeklyRevenue = dashboardData?.weekly_revenue || [];
  const popularServices = dashboardData?.popular_services || [];

  return (
    <div className="flex min-h-screen bg-glowup-bg font-inter">
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 ml-[280px] min-h-screen">
        <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
                Ringkasan Bisnis
              </h1>
              <p className="text-[#5E5F5B] text-base font-normal leading-6">
                Berikut adalah performa real-time untuk salon **{dashboardData?.salon_name}**.
              </p>
            </div>
            <div className="flex items-center gap-4 flex-shrink-0">
              <div className="flex items-center gap-2 px-6 py-2 rounded-[20px] border border-[rgba(210,195,199,0.20)] bg-[rgba(255,255,255,0.85)] backdrop-blur-sm shadow-[0_10px_30px_-10px_rgba(121,84,101,0.12)]">
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V3.33333C0 2.875 0.163194 2.48264 0.489583 2.15625C0.815972 1.82986 1.20833 1.66667 1.66667 1.66667H2.5V0H4.16667V1.66667H10.8333V0H12.5V1.66667H13.3333C13.7917 1.66667 14.184 1.82986 14.5104 2.15625C14.8368 2.48264 15 2.875 15 3.33333V15C15 15.4583 14.8368 15.8507 14.5104 16.1771C14.184 16.5035 13.7917 16.6667 13.3333 16.6667H1.66667ZM1.66667 15H13.3333V6.66667H1.66667V15ZM1.66667 5H13.3333V3.33333H1.66667V5Z" fill="#795465" />
                </svg>
                <span className="text-[#1B1C1C] font-semibold text-sm leading-5">
                  {new Date().toLocaleString("id-ID", { dateStyle: "long" })}
                </span>
              </div>
            </div>
          </header>

          {error && (
            <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
              {error}
            </div>
          )}

          {/* Analytics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Total Booking */}
            <div className="relative bg-white border border-gray-100 rounded-[20px] p-10 flex flex-col gap-1 overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start">
                <div className="w-[47px] h-[54px] rounded-xl bg-pink-100/40 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#795465" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 font-semibold text-[13px] tracking-[0.65px] uppercase mt-3">
                TOTAL BOOKING
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[#1B1C1C] font-bold text-[36px] leading-[45px]">
                  {stats?.total_bookings}
                </span>
              </div>
            </div>

            {/* Total Pendapatan */}
            <div className="relative bg-white border border-gray-100 rounded-[20px] p-10 flex flex-col gap-1 overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start">
                <div className="w-[47px] h-[54px] rounded-xl bg-yellow-100/40 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#675F2B" strokeWidth="2">
                    <line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 font-semibold text-[13px] tracking-[0.65px] uppercase mt-3">
                TOTAL PENDAPATAN
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[#1B1C1C] font-bold text-[30px] leading-[45px] truncate">
                  {stats?.total_revenue}
                </span>
              </div>
            </div>

            {/* Rating Salon */}
            <div className="relative bg-white border border-gray-100 rounded-[20px] p-10 flex flex-col gap-1 overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex justify-between items-start">
                <div className="w-[47px] h-[54px] rounded-xl bg-gray-100/40 flex items-center justify-center">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5E5F5B" strokeWidth="2">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
              </div>
              <p className="text-gray-400 font-semibold text-[13px] tracking-[0.65px] uppercase mt-3">
                RATING SALON
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-[#1B1C1C] font-bold text-[36px] leading-[45px]">
                  {stats?.avg_rating || "0.0"}
                </span>
                <span className="text-gray-400 text-sm font-normal">
                  / 5.0 ({stats?.review_count || 0} ulasan)
                </span>
              </div>
            </div>
          </div>

          {/* Charts + Popular Services */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_316px] gap-6">
            
            {/* Revenue Trend Chart */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-10 flex flex-col gap-10 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div>
                <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Statistik Pendapatan</h2>
                <p className="text-gray-400 text-sm font-normal">Tren penjualan 7 hari terakhir</p>
              </div>

              {/* Line Chart */}
              <div className="w-full h-[260px]">
                {weeklyRevenue.length === 0 ? (
                  <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                    Belum ada data grafik penjualan.
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyRevenue} margin={{ top: 20, right: 10, left: 10, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
                      <XAxis 
                        dataKey="day" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fontSize: 12, fill: '#6B7280', fontWeight: 600 }}
                        dy={10}
                      />
                      <YAxis hide={true} domain={[0, 100]} />
                      <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px -10px rgba(0,0,0,0.1)', fontWeight: 'bold', color: '#DB2777' }}
                        formatter={(value, name, props) => [props.payload.label, ""]}
                        labelStyle={{ display: 'none' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="height" 
                        stroke="#DB2777" 
                        strokeWidth={3} 
                        dot={{ r: 4, strokeWidth: 2, fill: '#fff', stroke: '#DB2777' }} 
                        activeDot={{ r: 6, fill: '#DB2777', stroke: '#fff', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>

            {/* Popular Services */}
            <div className="bg-white border border-gray-100 rounded-[20px] p-10 flex flex-col justify-between shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="flex flex-col gap-6">
                <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Layanan Terpopuler</h2>
                
                {popularServices.length === 0 ? (
                  <p className="text-gray-400 text-sm">Belum ada pemesanan layanan.</p>
                ) : (
                  <div className="flex flex-col gap-8">
                    {popularServices.map((service, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <img
                          src={service.img}
                          alt={service.name}
                          className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
                        />
                        <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                          <span className="text-[#1B1C1C] font-bold text-sm leading-5 truncate">{service.name}</span>
                          <span className="text-gray-400 text-xs font-normal leading-4">{service.bookings}</span>
                        </div>
                        <span className="text-[#795465] font-bold text-sm leading-5 flex-shrink-0">
                          {service.price}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-white border border-gray-100 rounded-[24px] overflow-hidden shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
            <div className="flex justify-between items-center px-10 py-6 border-b border-gray-150 bg-gray-50/50">
              <div className="flex flex-col gap-1">
                <h2 className="text-[#1B1C1C] font-bold text-xl leading-7">Booking Terbaru</h2>
                <p className="text-gray-400 text-xs font-normal leading-4">Pemesanan layanan terbaru dari pelanggan Anda</p>
              </div>
            </div>

            <div className="overflow-x-auto scrollbar-hide">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50/30">
                    <th className="px-10 py-8 text-left text-gray-400 font-bold text-xs uppercase tracking-[1.2px]">Pelanggan</th>
                    <th className="px-10 py-8 text-left text-gray-400 font-bold text-xs uppercase tracking-[1.2px]">Layanan</th>
                    <th className="px-10 py-6 text-left text-gray-400 font-bold text-xs uppercase tracking-[1.2px]">Waktu & Tanggal</th>
                    <th className="px-10 py-6 text-left text-gray-400 font-bold text-xs uppercase tracking-[1.2px]">Total Bayar</th>
                    <th className="px-10 py-8 text-left text-gray-400 font-bold text-xs uppercase tracking-[1.2px]">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentBookings.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-12 text-gray-500 font-medium">Belum ada pesanan terbaru.</td>
                    </tr>
                  ) : (
                    recentBookings.map((booking, i) => {
                      const badge = getStatusBadge(booking.status);
                      return (
                        <tr
                          key={booking.id || i}
                          className={i > 0 ? "border-t border-gray-50" : ""}
                        >
                          {/* Customer */}
                          <td className="px-10 py-6">
                            <div className="flex items-center gap-4">
                              <div
                                className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] font-bold text-base"
                                style={{ backgroundColor: "#F8C8DC", color: "#795465" }}
                              >
                                {getInitials(booking.name)}
                              </div>
                              <div className="flex flex-col">
                                <span className="text-[#1B1C1C] font-bold text-sm leading-5">{booking.name}</span>
                                <span className="text-gray-450 text-[11px] font-normal">{booking.email}</span>
                              </div>
                            </div>
                          </td>
                          {/* Service */}
                          <td className="px-10 py-6">
                            <span className="text-[#1B1C1C] font-medium text-sm leading-5 truncate block max-w-[200px]">{booking.service}</span>
                          </td>
                          {/* Date/Time */}
                          <td className="px-10 py-6">
                            <div className="flex flex-col">
                              <span className="text-[#1B1C1C] font-bold text-sm leading-5">{booking.date}</span>
                              <span className="text-gray-400 text-[11px] font-normal">{booking.time}</span>
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
                              style={{ backgroundColor: badge.bg, color: badge.text }}
                            >
                              {badge.label}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
