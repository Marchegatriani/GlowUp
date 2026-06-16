import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

import { HelpIcon, LogoutIcon } from "./icons";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/login");
  };

  const getLinkClass = (path) => {
    return location.pathname.startsWith(path)
      ? "text-base font-medium pb-0.5 border-b-2 leading-6 text-[#8B6B7A] border-[#8B6B7A]"
      : "text-base font-medium text-gray-500 hover:text-gray-700 leading-6 transition-colors";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold leading-8" style={{ color: "#8B6B7A" }}>
            GlowUp
          </Link>

          {/* Nav Links - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to="/user/beranda" className={getLinkClass('/user/beranda')}>
              Beranda
            </Link>
            <Link to="/user/jelajah" className={getLinkClass('/user/jelajah')}>
              Jelajahi Salon
            </Link>
            <Link to="/user/riwayat-booking" className={getLinkClass('/user/riwayat-booking')}>
              Booking
            </Link>
            <Link to="/user/riwayat-review" className={getLinkClass('/user/riwayat-review')}>
              Review
            </Link>
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            <button className="hidden sm:flex items-center gap-2 text-gray-600 text-sm font-medium hover:text-gray-800 transition-colors">
              <HelpIcon />
              <span>Bantuan</span>
            </button>
            <button 
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogoutIcon />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}