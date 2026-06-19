import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import { LogoutIcon } from "./icons";

export default function UserLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getLinkClass = (path) => {
    const isActive = path === "/" 
      ? location.pathname === "/"
      : location.pathname.startsWith(path);
    return isActive
      ? "text-base font-semibold pb-0.5 border-b-2 leading-6 text-glowup-brand border-glowup-brand"
      : "text-base font-medium text-gray-500 hover:text-gray-700 leading-6 transition-colors";
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif]">
      {/* Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 h-20 flex items-center justify-between">
          {/* Brand */}
          <Link to="/" className="text-2xl font-bold leading-8 text-glowup-brand">
            GlowUp
          </Link>

          {/* Nav Links - hidden on mobile */}
          <nav className="hidden md:flex items-center gap-8">
            <Link to={isAuthenticated ? "/user/beranda" : "/"} className={getLinkClass(isAuthenticated ? "/user/beranda" : "/")}>
              Beranda
            </Link>
            <Link to="/user/jelajah" className={getLinkClass('/user/jelajah')}>
              Jelajahi Salon
            </Link>
            {isAuthenticated && (
              <>
                <Link to="/user/riwayat-booking" className={getLinkClass('/user/riwayat-booking')}>
                  Booking
                </Link>
                <Link to="/user/riwayat-review" className={getLinkClass('/user/riwayat-review')}>
                  Review
                </Link>
              </>
            )}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 text-sm font-medium hover:text-red-600 transition-colors cursor-pointer"
                >
                  <LogoutIcon />
                  <span>Keluar</span>
                </button>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link
                  to="/login"
                  className="px-5 py-2 rounded-full border border-[rgba(121,84,101,0.20)] text-glowup-brand text-sm hover:bg-[rgba(121,84,101,0.05)] transition-colors font-semibold"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-full text-glowup-dark text-sm font-bold shadow-sm transition-opacity hover:opacity-90 bg-glow-gradient"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <Outlet />
    </div>
  );
}