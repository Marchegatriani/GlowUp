import { Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

const NAV_LINKS = [
  { label: "Beranda", href: "/" },
  { label: "Jelajahi Salon", href: "/user/jelajah" },
];

const SERVICE_CARDS = [
  {
    title: "Skincare & Facial",
    price: "Rp 250.000",
    img: "https://api.builder.io/api/v1/image/assets/TEMP/5eeeb5bdb5499bcd20339e2321d17b70af6240cf?width=540",
  },
  {
    title: "Hair Styling",
    price: "Rp 150.000",
    img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=540&q=80",
  },
  {
    title: "Manicure & Pedicure",
    price: "Rp 100.000",
    img: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=540&q=80",
  },
  {
    title: "Body Spa & Massage",
    price: "Rp 300.000",
    img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=540&q=80",
  },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-[rgba(210,195,199,0.10)] shadow-sm">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 h-20 flex items-center justify-between">
        <div className="flex items-center gap-10 lg:gap-16">
          <Link to="/" className="text-glow-mauve font-bold text-2xl lg:text-[28px] leading-[42px]">
            GlowUp
          </Link>
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10">
            {NAV_LINKS.map((link, i) => (
              <Link
                key={link.href}
                to={link.href}
                className={`text-base leading-6 transition-colors relative pb-1 ${
                  i === 0
                    ? "text-glow-mauve font-semibold after:absolute after:bottom-[-4px] after:left-0 after:right-0 after:h-0.5 after:bg-glow-mauve"
                    : "text-glow-medium font-normal hover:text-glow-mauve"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            to="/login"
            className="px-6 py-2 rounded-[20px] border border-[rgba(121,84,101,0.20)] text-glow-mauve text-base leading-6 hover:bg-[rgba(121,84,101,0.05)] transition-colors"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="px-6 py-2 rounded-[20px] text-[#2E1221] text-base leading-6 font-medium"
            style={{ background: "linear-gradient(113deg, #F8C8DC 0%, #EFE4A2 100%)" }}
          >
            Daftar
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-glow-mauve"
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
              className="text-glow-medium text-base py-2 hover:text-glow-mauve transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-2">
            <Link
              to="/login"
              className="flex-1 text-center px-4 py-2 rounded-[20px] border border-[rgba(121,84,101,0.20)] text-glow-mauve text-sm"
            >
              Masuk
            </Link>
            <Link
              to="/register"
              className="flex-1 text-center px-4 py-2 rounded-[20px] text-[#2E1221] text-sm font-medium"
              style={{ background: "linear-gradient(113deg, #F8C8DC 0%, #EFE4A2 100%)" }}
            >
              Daftar
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function HeroSection() {
  return (
    <section className="pt-20 min-h-screen bg-[#FCF9F8]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
        {/* Left */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <h1 className="text-[#1B1C1C] font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] tracking-[-1.12px]">
            <span>Temukan </span>
            <span
              className="inline-flex px-3 py-1 rounded-[20px] text-white"
              style={{ background: "#795465" }}
            >
              GlowUp
            </span>
            <br />
            <span>Terbaikmu</span>
          </h1>

          <p className="text-[#5E5F5B] text-base sm:text-lg font-light leading-[1.6] max-w-[480px]">
            Nikmati kemudahan reservasi layanan kecantikan premium mulai dari hair styling hingga spa eksklusif di ujung jari Anda.
          </p>

          {/* Search bar */}
          <div className="mt-2 w-full max-w-[560px]">
            <div
              className="flex items-stretch bg-white rounded-[32px] p-2.5 gap-0"
              style={{
                border: "1px solid rgba(210, 195, 199, 0.10)",
                boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)",
              }}
            >
              {/* Location */}
              <div className="flex items-center gap-3 px-4 flex-1 border-r border-[rgba(210,195,199,0.20)]">
                <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0">
                  <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#795465" fillOpacity="0.6"/>
                </svg>
                <span className="text-[#6B7280] text-sm sm:text-base whitespace-nowrap">Pilih Lokasi</span>
              </div>

              {/* Service */}
              <div className="hidden sm:flex items-center gap-3 px-4 flex-1 border-r border-[rgba(210,195,199,0.20)]">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
                  <path d="M17 19L10 12L7.65 14.35C7.78333 14.6 7.875 14.8667 7.925 15.15C7.975 15.4333 8 15.7167 8 16C8 17.1 7.60833 18.0417 6.825 18.825C6.04167 19.6083 5.1 20 4 20C2.9 20 1.95833 19.6083 1.175 18.825C0.391667 18.0417 0 17.1 0 16C0 14.9 0.391667 13.9583 1.175 13.175C1.95833 12.3917 2.9 12 4 12C4.28333 12 4.56667 12.025 4.85 12.075C5.13333 12.125 5.4 12.2167 5.65 12.35L8 10L5.65 7.65C5.4 7.78333 5.13333 7.875 4.85 7.925C4.56667 7.975 4.28333 8 4 8C2.9 8 1.95833 7.60833 1.175 6.825C0.391667 6.04167 0 5.1 0 4C0 2.9 0.391667 1.95833 1.175 1.175C1.95833 0.391667 2.9 0 4 0C5.1 0 6.04167 0.391667 6.825 1.175C7.60833 1.95833 8 2.9 8 4C8 4.28333 7.975 4.56667 7.925 4.85C7.875 5.13333 7.78333 5.4 7.65 5.65L20 18V19H17ZM13 9L11 7L17 1H20V2L13 9ZM4 6C4.55 6 5.02083 5.80417 5.4125 5.4125C5.80417 5.02083 6 4.55 6 4C6 3.45 5.80417 2.97917 5.4125 2.5875C5.02083 2.19583 4.55 2 4 2C3.45 2 2.97917 2.19583 2.5875 2.5875C2.19583 2.97917 2 3.45 2 4C2 4.55 2.19583 5.02083 2.5875 5.4125C2.97917 5.80417 3.45 6 4 6ZM10 10.5C10.1333 10.5 10.25 10.45 10.35 10.35C10.45 10.25 10.5 10.1333 10.5 10C10.5 9.86667 10.45 9.75 10.35 9.65C10.25 9.55 10.1333 9.5 10 9.5C9.86667 9.5 9.75 9.55 9.65 9.65C9.55 9.75 9.5 9.86667 9.5 10C9.5 10.1333 9.55 10.25 9.65 10.35C9.75 10.45 9.86667 10.5 10 10.5ZM4 18C4.55 18 5.02083 17.8042 5.4125 17.4125C5.80417 17.0208 6 16.55 6 16C6 15.45 5.80417 14.9792 5.4125 14.5875C5.02083 14.1958 4.55 14 4 14C3.45 14 2.97917 14.1958 2.5875 14.5875C2.19583 14.9792 2 15.45 2 16C2 16.55 2.19583 17.0208 2.5875 17.4125C2.97917 17.8042 3.45 18 4 18Z" fill="#795465" fillOpacity="0.6"/>
                </svg>
                <span className="text-[#6B7280] text-base whitespace-nowrap">Cari Layanan</span>
              </div>

              {/* Date */}
              <div className="hidden md:flex items-center gap-3 px-4 flex-1">
                <svg width="18" height="20" viewBox="0 0 18 20" fill="none" className="shrink-0">
                  <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6ZM2 6V4V6Z" fill="#795465" fillOpacity="0.6"/>
                </svg>
                <span className="text-[#6B7280] text-base whitespace-nowrap">Atur Tanggal</span>
              </div>

              <button
                className="shrink-0 px-8 py-3 rounded-[20px] text-[#2E1221] font-bold text-base leading-6"
                style={{ background: "linear-gradient(113deg, #F8C8DC 0%, #EFE4A2 100%)" }}
              >
                Cari
              </button>
            </div>
          </div>
        </div>

        {/* Right - Hero Image */}
        <div className="lg:col-span-6 flex justify-end items-start mt-8 lg:mt-0">
          <div className="relative w-full max-w-[560px]">
            <div
              className="w-full aspect-[4/5] rounded-[32px] overflow-hidden"
              style={{
                border: "4px solid rgba(255, 255, 255, 0.50)",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/d98eec8b0febc9b0dd9f5bd7796bd46611f919be?width=1072"
                alt="Salon interior"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Rating card - top right */}
            <div
              className="absolute top-6 right-0 translate-x-2 sm:translate-x-0 flex items-center gap-4 px-4 py-4 rounded-[20px]"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.50)",
                background: "rgba(255, 255, 255, 0.70)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <div className="w-10 h-10 rounded-full bg-[#F8C8DC] flex items-center justify-center shrink-0">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none">
                  <path d="M3.1875 15.8333L4.54167 9.97917L0 6.04167L6 5.52083L8.33333 0L10.6667 5.52083L16.6667 6.04167L12.125 9.97917L13.4792 15.8333L8.33333 12.7292L3.1875 15.8333Z" fill="#795465"/>
                </svg>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-glow-mauve font-bold text-base leading-4">4.9/5</span>
                <span className="text-[#5E5F5B] text-xs leading-[18px]">Rating Tertinggi</span>
              </div>
            </div>

            {/* Popular services card - bottom left */}
            <div
              className="absolute bottom-6 left-0 -translate-x-2 sm:translate-x-0 flex flex-col gap-3 px-5 py-5 rounded-[20px]"
              style={{
                border: "1px solid rgba(255, 255, 255, 0.50)",
                background: "rgba(255, 255, 255, 0.70)",
                backdropFilter: "blur(10px)",
                boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)",
              }}
            >
              <span className="text-glow-mauve font-bold text-xs leading-[18px]">Layanan Populer</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-[rgba(121,84,101,0.10)] text-glow-mauve text-xs font-medium">Hair Cut</span>
                <span className="px-3 py-1 rounded-full bg-[rgba(103,95,43,0.10)] text-[#675F2B] text-xs font-medium">Facial</span>
                <span className="px-3 py-1 rounded-full bg-[rgba(94,95,91,0.10)] text-[#5E5F5B] text-xs font-medium">Nail Art</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturesSection() {
  return (
    <section className="bg-[#FCF9F8] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-5 mb-16">
          <span
            className="px-6 py-1.5 rounded-full text-glow-mauve text-xs font-bold tracking-[0.65px] uppercase"
            style={{ background: "rgba(248, 200, 220, 0.40)" }}
          >
            KEUNGGULAN KAMI
          </span>
          <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[1.2] tracking-[-0.4px] text-center">
            Kenapa Memilih GlowUp?
          </h2>
        </div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {/* Bento Item 1 - large left spanning 2 rows */}
          <div
            className="md:col-span-1 lg:col-span-8 lg:row-span-2 bg-white rounded-[32px] p-10 flex flex-col justify-end gap-4 min-h-[280px] lg:min-h-[584px]"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            {/* Calendar Icon */}
            <div className="mb-4">
              <svg width="180" height="200" viewBox="0 0 180 200" fill="none" opacity="0.05" className="hidden lg:block">
                <path d="M20 200C14.5 200 9.79167 198.042 5.875 194.125C1.95833 190.208 0 185.5 0 180V40C0 34.5 1.95833 29.7917 5.875 25.875C9.79167 21.9583 14.5 20 20 20H30V0H50V20H130V0H150V20H160C165.5 20 170.208 21.9583 174.125 25.875C178.042 29.7917 180 34.5 180 40V180C180 185.5 178.042 190.208 174.125 194.125C170.208 198.042 165.5 200 160 200H20ZM20 180H160V80H20V180ZM20 60H160V40H20V60Z" fill="#795465"/>
              </svg>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="text-[#1B1C1C] font-semibold text-2xl leading-[1.4]">
                Reservasi Instan & Mudah
              </h3>
              <p className="text-[#5E5F5B] text-base leading-6 max-w-[448px]">
                Pesan jadwal salon favoritmu hanya dalam hitungan detik. Sistem kalender cerdas kami memastikan Anda mendapatkan slot waktu terbaik tanpa hambatan.
              </p>
            </div>
          </div>

          {/* Bento Item 2 - top right, dark mauve */}
          <div
            className="md:col-span-1 lg:col-span-4 bg-[#795465] rounded-[32px] flex flex-col items-center justify-center gap-4 py-10 px-8 min-h-[280px]"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            <svg width="38" height="47" viewBox="0 0 38 47" fill="none">
              <path d="M16.2167 31.6167L29.4 18.4333L26.075 15.1083L16.2167 24.9667L11.3167 20.0667L7.99167 23.3917L16.2167 31.6167ZM18.6667 46.6667C13.2611 45.3056 8.79861 42.2042 5.27917 37.3625C1.75972 32.5208 0 27.1444 0 21.2333V7L18.6667 0L37.3333 7V21.2333C37.3333 27.1444 35.5736 32.5208 32.0542 37.3625C28.5347 42.2042 24.0722 45.3056 18.6667 46.6667ZM18.6667 41.7667C22.7111 40.4833 26.0556 37.9167 28.7 34.0667C31.3444 30.2167 32.6667 25.9389 32.6667 21.2333V10.2083L18.6667 4.95833L4.66667 10.2083V21.2333C4.66667 25.9389 5.98889 30.2167 8.63333 34.0667C11.2778 37.9167 14.6222 40.4833 18.6667 41.7667Z" fill="#E9BACD"/>
            </svg>
            <div className="text-center">
              <h3 className="text-white font-bold text-xl leading-7 mb-2">Salon Terverifikasi</h3>
              <p className="text-white/80 text-sm leading-[1.625] text-center">
                Bekerja sama dengan mitra yang memiliki standar kualitas dan kebersihan tinggi.
              </p>
            </div>
          </div>

          {/* Bento Item 3 - bottom right, yellow */}
          <div
            className="md:col-span-1 lg:col-span-4 bg-[#EFE4A2] rounded-[32px] flex flex-col justify-between gap-6 p-10 min-h-[280px]"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center shadow-sm">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="#675F2B"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2">
              <h3 className="text-[#201C00] font-bold text-xl leading-7">Harga Transparan</h3>
              <p className="text-[#4E4715] text-sm leading-[1.625]">
                Cek daftar harga detail sebelum booking, tanpa biaya tersembunyi yang mengejutkan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function SalonsSection({ salons, loading }) {
  return (
    <section className="bg-[#FCF9F8] py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
          <div className="flex flex-col gap-2">
            <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[1.2] tracking-[-0.4px]">
              Daftar Salon Terpopuler
            </h2>
            <p className="text-[#5E5F5B] text-base leading-6">
              Temukan dan kunjungi salon kecantikan terbaik di sekitar Anda.
            </p>
          </div>
          <Link to="/user/jelajah" className="text-glow-mauve font-bold text-base leading-6 shrink-0 hover:underline">
            Lihat Semua
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Memuat daftar salon...
          </div>
        ) : salons.length === 0 ? (
          <div className="text-center py-20 text-gray-500 font-medium">
            Belum ada salon terdaftar saat ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {salons.map((salon) => (
              <Link
                to={`/user/salon/${salon.id}`}
                key={salon.id}
                className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all p-4 group flex flex-col justify-between"
              >
                <div>
                  <div className="w-full aspect-[4/3] rounded-[18px] overflow-hidden bg-gray-100 mb-4">
                    <img
                      src={salon.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=540&q=80"}
                      alt={salon.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="text-[#1B1C1C] font-bold text-lg leading-7 group-hover:text-glow-mauve transition-colors truncate">
                    {salon.name}
                  </h4>
                  <p className="text-sm text-[#5E5F5B] line-clamp-1 mt-1">
                    {salon.address || "Lokasi belum tersedia"}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-450 mt-4 border-t border-gray-50 pt-3">
                  <span>
                    {salon.open_time?.substring(0, 5) || "09:00"} - {salon.close_time?.substring(0, 5) || "21:00"}
                  </span>
                  <span className="text-glow-mauve font-bold group-hover:underline">Detail →</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-[#FCF9F8] py-16 lg:py-20 px-4">
      <div
        className="max-w-[1280px] mx-auto rounded-[32px] px-6 py-16 sm:py-20 flex flex-col items-center gap-8"
        style={{ background: "rgba(248, 200, 220, 0.25)" }}
      >
        <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.2] tracking-[-0.5px] text-center max-w-xl">
          Siap Untuk Tampil Mempesona?
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center px-12 py-[17px] rounded-[20px] text-[#2E1221] font-bold text-lg leading-7"
            style={{ background: "linear-gradient(105deg, #F8C8DC 0%, #EFE4A2 100%)" }}
          >
            Mulai Sekarang
          </Link>
          <Link
            to="/kontak"
            className="w-full sm:w-auto text-center px-12 py-4 rounded-[20px] text-[#1B1C1C] font-bold text-lg leading-7 bg-white"
            style={{ border: "1px solid rgba(210, 195, 199, 0.20)" }}
          >
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-white border-t border-[rgba(210,195,199,0.10)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
            <Link to="/" className="text-glow-mauve font-bold text-[28px] leading-[42px]">GlowUp</Link>
            <p className="text-[#5E5F5B] text-base leading-6 max-w-[320px]">
              Platform reservasi salon kecantikan premium pertama di Indonesia yang mengutamakan kenyamanan dan kualitas layanan.
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
                <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glow-mauve transition-colors">
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
                <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glow-mauve transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
            <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">LANGGANAN NEWSLETTER</h4>
            <p className="text-[#5E5F5B] text-sm leading-5">
              Dapatkan penawaran eksklusif dan update gaya terbaru langsung di email Anda.
            </p>
            <div className="flex items-stretch gap-2">
              <input
                type="email"
                placeholder="Masukkan email Anda"
                className="flex-1 px-5 py-[17px] rounded-[20px] bg-[#F6F3F2] text-[#6B7280] text-sm outline-none placeholder-[#6B7280] focus:ring-2 focus:ring-glow-mauve/30"
              />
              <button
                className="w-14 h-14 rounded-[20px] bg-glow-mauve flex items-center justify-center shrink-0 hover:bg-[#6a4858] transition-colors"
                style={{ boxShadow: "0 10px 15px -3px rgba(0,0,0,0.10), 0 4px 6px -4px rgba(0,0,0,0.10)" }}
              >
                <svg width="19" height="16" viewBox="0 0 19 16" fill="none">
                  <path d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13ZM2 13V8V3V6.5V9.5V13Z" fill="white"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-[rgba(210,195,199,0.10)] py-10 text-center">
        <p className="text-[#5E5F5B] text-[13px] font-medium leading-[19.5px] tracking-[0.325px]">
          © 2024 GlowUp Indonesia. Seluruh hak cipta dilindungi.
        </p>
      </div>
    </footer>
  );
}

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

  if (isAuthenticated) {
    return <Navigate to="/user/beranda" replace />;
  }

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axiosClient.get("/salons");
        setSalons(response.data.slice(0, 4)); // Get top 4 salons
      } catch (error) {
        console.error("Gagal mengambil data salon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  return (
    <div className="min-h-screen bg-[#FCF9F8]">
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SalonsSection salons={salons} loading={loading} />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
