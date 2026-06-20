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
    <footer className="border-t border-[rgba(210,195,199,0.10)] py-8">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col items-center justify-center gap-2 text-center">
        <p className="text-sm font-semibold tracking-[0.14px]" style={{ color: "#5E5F5B" }}>
          © 2026 GlowUp. Semua Hak Dilindungi.
        </p>
        <p className="text-xs font-medium" style={{ color: "rgba(94, 95, 91, 0.60)" }}>
          Estetika Premium untuk Setiap Langkah Anda.
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
