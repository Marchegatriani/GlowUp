import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function DashboardAdmin() {
  const [stats, setStats] = useState(null);
  const [adminName, setAdminName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await axiosClient.get("/admin/dashboard");
        setStats(response.data.stats);
        setAdminName(response.data.admin_name);
      } catch (err) {
        console.error("Gagal memuat data dashboard admin:", err);
        setError("Gagal memuat data statistik dashboard.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
          Dashboard Admin
        </h1>
        <p className="text-[#5E5F5B] text-base font-normal leading-6">
          Selamat datang kembali, <span className="font-semibold text-[#8B6B7A]">{adminName || "Admin"}</span>. Pantau aktivitas dan pertumbuhan platform GlowUp.
        </p>
      </header>

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">
          Memuat statistik dashboard...
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Total Users */}
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[#5E5F5B] text-sm font-bold uppercase tracking-wider">Total Pengguna</span>
                <h2 className="text-[#1B1C1C] font-extrabold text-5xl tracking-tight mt-2">
                  {stats?.total_users || 0}
                </h2>
              </div>
              <div className="p-4 bg-[rgba(121,84,101,0.05)] rounded-2xl text-[#8B6B7A]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 flex gap-6 text-sm text-[#5E5F5B]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
                <span>Owner: <strong className="text-gray-800">{stats?.total_owners || 0}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span>Customer: <strong className="text-gray-800">{stats?.total_customers || 0}</strong></span>
              </div>
            </div>

            <Link
              to="/admin/users"
              className="text-[#8B6B7A] font-bold text-sm hover:text-[#795465] transition-colors mt-2 inline-flex items-center gap-1 group self-start"
            >
              Kelola Pengguna
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>

          {/* Card 2: Total Salons */}
          <div className="bg-white rounded-3xl border border-gray-150 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-6 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all">
            <div className="flex justify-between items-start">
              <div className="flex flex-col gap-1">
                <span className="text-[#5E5F5B] text-sm font-bold uppercase tracking-wider">Total Mitra Salon</span>
                <h2 className="text-[#1B1C1C] font-extrabold text-5xl tracking-tight mt-2">
                  {stats?.total_salons || 0}
                </h2>
              </div>
              <div className="p-4 bg-[rgba(121,84,101,0.05)] rounded-2xl text-[#8B6B7A]">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
                </svg>
              </div>
            </div>

            <div className="border-t border-gray-100 pt-4 text-sm text-[#5E5F5B]">
              Salon yang terdaftar dan menawarkan layanan di GlowUp.
            </div>

            <Link
              to="/admin/salons"
              className="text-[#8B6B7A] font-bold text-sm hover:text-[#795465] transition-colors mt-2 inline-flex items-center gap-1 group self-start"
            >
              Kelola Mitra Salon
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
