import { Link, Outlet } from "react-router-dom";
import { useState } from "react";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi Salon", href: "/user/jelajah" },
];

export function PublicNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[rgba(210,195,199,0.10)] shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10 lg:gap-16">
          <Link to="/" className="text-glowup-brand font-bold text-2xl lg:text-[28px] leading-[42px]">
            GlowUp
          </Link>
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((link, i) => {
              const isActive = link.href === "/" 
                ? window.location.pathname === "/" 
                : window.location.pathname.startsWith(link.href);
              return (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base leading-6 transition-colors relative pb-1 ${
                  isActive
                    ? "text-glowup-brand font-semibold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-glowup-brand"
                    : "text-glowup-muted font-normal hover:text-glowup-brand"
                }`}
              >
                {link.label}
              </Link>
            )})}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-[20px] border border-[rgba(121,84,101,0.20)] text-glowup-brand text-base leading-6 hover:bg-[rgba(121,84,101,0.05)] transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-[20px] text-glowup-dark text-base leading-6 font-medium bg-glow-gradient"
          >
            Daftar
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-glowup-brand"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            {menuOpen ? (
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" strokeLinecap="round" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <div className="lg:hidden bg-white/95 backdrop-blur-md border-t border-[rgba(210,195,199,0.10)] px-4 py-4 flex flex-col gap-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className="text-glowup-muted text-base py-2 hover:text-glowup-brand transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2 rounded-[20px] border border-[rgba(121,84,101,0.20)] text-glowup-brand text-sm"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center px-4 py-2 rounded-[20px] text-glowup-dark text-sm font-medium bg-glow-gradient"
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-white border-t border-[rgba(210,195,199,0.10)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="text-glowup-brand font-bold text-[28px] leading-[42px]">GlowUp</Link>
            <p className="text-[#5E5F5B] text-base leading-6 max-w-[320px]">
              Platform Booking salon kecantikan premium pertama di Indonesia yang mengutamakan kenyamanan dan kualitas layanan.
            </p>
            <div className="flex items-center gap-4">
              {[
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667ZM7.5 14.9583V13.3333C7.04167 13.3333 6.64931 13.1701 6.32292 12.8438C5.99653 12.5174 5.83333 12.125 5.83333 11.6667V10.8333L1.83333 6.83333C1.79167 7.08333 1.75347 7.33333 1.71875 7.58333C1.68403 7.83333 1.66667 8.08333 1.66667 8.33333C1.66667 10.0139 2.21875 11.4861 3.32292 12.75C4.42708 14.0139 5.81944 14.75 7.5 14.9583ZM13.25 12.8333C13.8194 12.2083 14.2535 11.5104 14.5521 10.7396C14.8507 9.96875 15 9.16667 15 8.33333C15 6.97222 14.6215 5.72917 13.8646 4.60417C13.1076 3.47917 12.0972 2.66667 10.8333 2.16667V2.5C10.8333 2.95833 10.6701 3.35069 10.3438 3.67708C10.0174 4.00347 9.625 4.16667 9.16667 4.16667H7.5V5.83333C7.5 6.06944 7.42014 6.26736 7.26042 6.42708C7.10069 6.58681 6.90278 6.66667 6.66667 6.66667H5V8.33333H10C10.2361 8.33333 10.434 8.41319 10.5938 8.57292C10.7535 8.73264 10.8333 8.93056 10.8333 9.16667V11.6667H11.6667C12.0278 11.6667 12.3542 11.7743 12.6458 11.9896C12.9375 12.2049 13.1389 12.4861 13.25 12.8333Z" fill="#795465"/></svg>,
                <svg width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M7.83333 5.83333H14.5C14.125 4.875 13.5521 4.05208 12.7812 3.36458C12.0104 2.67708 11.125 2.19444 10.125 1.91667L7.83333 5.83333ZM5.91667 7.5L9.25 1.75C9.09722 1.72222 8.94444 1.70139 8.79167 1.6875C8.63889 1.67361 8.48611 1.66667 8.33333 1.66667C7.41667 1.66667 6.5625 1.84028 5.77083 2.1875C4.97917 2.53472 4.27778 3 3.66667 3.58333L5.91667 7.5ZM1.875 10H6.41667L3.08333 4.25C2.63889 4.81944 2.29167 5.44792 2.04167 6.13542C1.79167 6.82292 1.66667 7.55556 1.66667 8.33333C1.66667 8.625 1.68403 8.90625 1.71875 9.17708C1.75347 9.44792 1.80556 9.72222 1.875 10ZM6.54167 14.75L8.79167 10.8333H2.16667C2.54167 11.7917 3.11458 12.6146 3.88542 13.3021C4.65625 13.9896 5.54167 14.4722 6.54167 14.75ZM8.33333 15C9.25 15 10.1042 14.8264 10.8958 14.4792C11.6875 14.1319 12.3889 13.6667 13 13.0833L10.75 9.16667L7.41667 14.9167C7.56944 14.9444 7.71875 14.9653 7.86458 14.9792C8.01042 14.9931 8.16667 15 8.33333 15ZM13.5833 12.4167C14.0278 11.8472 14.375 11.2188 14.625 10.5312C14.875 9.84375 15 9.11111 15 8.33333C15 8.04167 14.9826 7.76042 14.9479 7.48958C14.9132 7.21875 14.8611 6.94444 14.7917 6.66667H10.25L13.5833 12.4167ZM8.33333 16.6667C7.19444 16.6667 6.11806 16.4479 5.10417 16.0104C4.09028 15.5729 3.20486 14.9757 2.44792 14.2188C1.69097 13.4618 1.09375 12.5764 0.65625 11.5625C0.21875 10.5486 0 9.47222 0 8.33333C0 7.18056 0.21875 6.10069 0.65625 5.09375C1.09375 4.08681 1.69097 3.20486 2.44792 2.44792C3.20486 1.69097 4.09028 1.69097 5.10417 0.65625C6.11806 0.21875 7.19444 0 8.33333 0C9.48611 0 10.566 0.21875 11.5729 0.65625C12.5799 1.09375 13.4618 1.69097 14.2188 2.44792C14.9757 3.20486 15.5729 4.08681 16.0104 5.09375C16.4479 6.10069 16.6667 7.18056 16.6667 8.33333C16.6667 9.47222 16.4479 10.5486 16.0104 11.5625C15.5729 12.5764 14.9757 13.4618 14.2188 14.2188C13.4618 14.9757 12.5799 15.5729 11.5729 16.0104C10.566 16.4479 9.48611 16.6667 8.33333 16.6667Z" fill="#795465"/></svg>,
                <svg width="15" height="17" viewBox="0 0 15 17" fill="none"><path d="M12.5 16.6667C11.8056 16.6667 11.2153 16.4236 10.7292 15.9375C10.2431 15.4514 10 14.8611 10 14.1667C10 14.0833 10.0208 13.8889 10.0625 13.5833L4.20833 10.1667C3.98611 10.375 3.72917 10.5382 3.4375 10.6562C3.14583 10.7743 2.83333 10.8333 2.5 10.8333C1.80556 10.8333 1.21528 10.5903 0.729167 10.1042C0.243056 9.61806 0 9.02778 0 8.33333C0 7.63889 0.243056 7.04861 0.729167 6.5625C1.21528 6.07639 1.80556 5.83333 2.5 5.83333C2.83333 5.83333 3.14583 5.89236 3.4375 6.01042C3.72917 6.12847 3.98611 6.29167 4.20833 6.5L10.0625 3.08333C10.0347 2.98611 10.0174 2.89236 10.0104 2.80208C10.0035 2.71181 10 2.61111 10 2.5C10 1.80556 10.2431 1.21528 10.7292 0.729167C11.2153 0.243056 11.8056 0 12.5 0C13.1944 0 13.7847 0.243056 14.2708 0.729167C14.7569 1.21528 15 1.80556 15 2.5C15 3.19444 14.7569 3.78472 14.2708 4.27083C13.7847 4.75694 13.1944 5 12.5 5C12.1667 5 11.8542 4.94097 11.5625 4.82292C11.2708 4.70486 11.0139 4.54167 10.7917 4.33333L4.9375 7.75C4.96528 7.84722 4.98264 7.94097 4.98958 8.03125C4.99653 8.12153 5 8.22222 5 8.33333C5 8.44444 4.99653 8.54514 4.98958 8.63542C4.98264 8.72569 4.96528 8.81944 4.9375 8.91667L10.7917 12.3333C11.0139 12.125 11.2708 11.9618 11.5625 11.8438C11.8542 11.7257 12.1667 11.6667 12.5 11.6667C13.1944 11.6667 13.7847 11.9097 14.2708 12.3958C14.7569 12.8819 15 13.4722 15 14.1667C15 14.8611 14.7569 15.4514 14.2708 15.9375C13.7847 16.4236 13.1944 16.6667 12.5 16.6667Z" fill="#795465"/></svg>,
              ].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 rounded-[20px] bg-[rgba(121,84,101,0.05)] flex items-center justify-center hover:bg-[rgba(121,84,101,0.10)] transition-colors shadow-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">NAVIGASI</h4>
            <div className="flex flex-col gap-4">
              {["Tentang Kami", "Kontak Kami", "Pusat Bantuan", "FAQ"].map((item) => (
                <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glowup-brand transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Legalitas */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">LEGALITAS</h4>
            <div className="flex flex-col gap-4">
              {["Kebijakan Privasi", "Syarat & Ketentuan"].map((item) => (
                <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glowup-brand transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[rgba(210,195,199,0.10)] py-10 text-center">
        <p className="text-[#5E5F5B] text-[13px] font-medium leading-[19.5px] tracking-[0.325px]">
          © 2026 GlowUp Indonesia. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-glowup-bg flex flex-col">
      <PublicNavbar />
      <main className="flex-1 pt-20">
        <Outlet />
      </main>
      <PublicFooter />
    </div>
  );
}
