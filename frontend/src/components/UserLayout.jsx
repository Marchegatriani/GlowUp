import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";

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