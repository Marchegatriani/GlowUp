import { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosClient from "../api/axiosClient";

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [userRole, setUserRole] = useState("");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axiosClient.get("/me");
        setUserRole(response.data.role);
        setUserName(response.data.name);
      } catch (error) {
        console.error("Gagal mendapatkan info user di sidebar:", error);
      }
    };
    fetchUser();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const getLinkClass = (path) => {
    const isActive = location.pathname === path;
    return isActive
      ? "flex items-center gap-3 px-6 py-4 rounded-xl text-glowup-dark font-bold transition-all shadow-sm bg-glow-gradient"
      : "flex items-center gap-3 px-6 py-4 rounded-xl text-[#5E5F5B] hover:text-glowup-brand hover:bg-glowup-pink-50 font-medium transition-all";
  };

  const getLinkStyle = (path) => {
    return {};
  };

  // Navigations based on Role
  const adminNav = [
    { name: "Dashboard Admin", path: "/admin/dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
      </svg>
    )},
    { name: "Kelola User", path: "/admin/users", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    )},
    { name: "Kelola Salon", path: "/admin/salons", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )}
  ];

  const ownerNav = [
    { name: "Ringkasan Bisnis", path: "/owner/dashboard", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="4" />
      </svg>
    )},
    { name: "Kelola Booking", path: "/owner/bookings", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
      </svg>
    )},
    { name: "Kelola Layanan", path: "/owner/services", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    )},
    { name: "Kelola Profil Salon", path: "/owner/salon-profile", icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" />
      </svg>
    )}
  ];

  const navItems = userRole === "admin" ? adminNav : ownerNav;

  return (
    <aside className="w-[280px] h-screen bg-white border-r border-[#ECE6E7] fixed left-0 top-0 flex flex-col justify-between py-10 px-6 z-40">
      <div className="flex flex-col gap-10">
        {/* Brand */}
        <div className="px-4">
          <Link to="/" className="text-2xl font-bold leading-8 text-glowup-brand block">
            GlowUp
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 mt-1 block">
            {userRole === "admin" ? "Admin Panel" : "Owner Panel"}
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={getLinkClass(item.path)}
              style={getLinkStyle(item.path)}
            >
              {item.icon}
              <span className="text-sm font-semibold">{item.name}</span>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer / User info & Logout */}
      <div className="flex flex-col gap-6 px-4">
        <div className="flex flex-col">
          <span className="text-sm font-bold text-gray-800 truncate">{userName || "Loading..."}</span>
          <span className="text-[11px] text-gray-400 capitalize">{userRole}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 text-red-500 font-semibold text-sm hover:text-red-600 transition-colors w-full text-left"
        >
          <svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.66667 15C1.20833 15 0.815972 14.8368 0.489583 14.5104C0.163194 14.184 0 13.7917 0 13.3333V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H7.5V1.66667H1.66667V13.3333H7.5V15H1.66667ZM10.8333 11.6667L9.6875 10.4583L11.8125 8.33333H5V6.66667H11.8125L9.6875 4.54167L10.8333 3.33333L15 7.5L10.8333 11.6667Z" fill="currentColor"/>
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}
