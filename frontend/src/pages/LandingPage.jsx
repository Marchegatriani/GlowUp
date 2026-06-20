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

import { PublicNavbar, PublicFooter } from "../components/PublicLayout";

function HeroSection() {
  return (
    <section className="pt-20 min-h-screen bg-glowup-bg">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 py-16 lg:py-20 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center min-h-[calc(100vh-80px)]">
        {/* Left */}
        <div className="lg:col-span-6 flex flex-col gap-6">
          <h1 className="text-[#1B1C1C] font-bold text-4xl sm:text-5xl lg:text-[56px] leading-[1.1] tracking-[-1.12px]">
            <span>Temukan </span>
            <span
              className="inline-flex px-3 py-1 rounded-[20px] text-white bg-glowup-brand"
            >
              GlowUp
            </span>
            <br />
            <span>Terbaikmu</span>
          </h1>

          <p className="text-[#5E5F5B] text-base sm:text-lg font-light leading-[1.6] max-w-[480px]">
            Nikmati kemudahan Booking layanan kecantikan premium mulai dari hair styling hingga spa eksklusif di ujung jari Anda.
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
                className="shrink-0 px-8 py-3 rounded-[20px] text-glowup-dark font-bold text-base leading-6 bg-glow-gradient"
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
                <span className="text-glowup-brand font-bold text-base leading-4">4.9/5</span>
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
              <span className="text-glowup-brand font-bold text-xs leading-[18px]">Layanan Populer</span>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-3 py-1 rounded-full bg-glowup-pink-50 text-glowup-brand text-xs font-medium">Hair Cut</span>
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
    <section className="bg-glowup-bg py-16 lg:py-20">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16">
        <div className="flex flex-col items-center gap-5 mb-16">
          <span
            className="px-6 py-1.5 rounded-full text-glowup-brand text-xs font-bold tracking-[0.65px] uppercase bg-glowup-pink-100"
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
            className="md:col-span-1 lg:col-span-8 lg:row-span-2 bg-white rounded-[32px] p-10 flex flex-col justify-end gap-4 min-h-[280px] lg:min-h-[584px] relative overflow-hidden group"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            <img src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80" alt="Booking Instan" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
            
            <div className="flex flex-col gap-4 relative z-10">
              <h3 className="text-white font-semibold text-2xl lg:text-3xl leading-[1.4]">
                Booking Instan & Mudah
              </h3>
              <p className="text-white/90 text-base leading-6 max-w-[448px]">
                Pesan jadwal salon favoritmu hanya dalam hitungan detik. Sistem kalender cerdas kami memastikan Anda mendapatkan slot waktu terbaik tanpa hambatan.
              </p>
            </div>
          </div>

          {/* Bento Item 2 - top right, dark mauve */}
          <div
            className="md:col-span-1 lg:col-span-4 rounded-[32px] flex flex-col items-center justify-center gap-4 py-10 px-8 min-h-[280px] relative overflow-hidden group"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=500&q=80" alt="Terverifikasi" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[#795465]/80 mix-blend-multiply"></div>
            
            <div className="relative z-10 flex flex-col items-center text-center gap-3">
              <svg width="38" height="47" viewBox="0 0 38 47" fill="none">
                <path d="M16.2167 31.6167L29.4 18.4333L26.075 15.1083L16.2167 24.9667L11.3167 20.0667L7.99167 23.3917L16.2167 31.6167ZM18.6667 46.6667C13.2611 45.3056 8.79861 42.2042 5.27917 37.3625C1.75972 32.5208 0 27.1444 0 21.2333V7L18.6667 0L37.3333 7V21.2333C37.3333 27.1444 35.5736 32.5208 32.0542 37.3625C28.5347 42.2042 24.0722 45.3056 18.6667 46.6667ZM18.6667 41.7667C22.7111 40.4833 26.0556 37.9167 28.7 34.0667C31.3444 30.2167 32.6667 25.9389 32.6667 21.2333V10.2083L18.6667 4.95833L4.66667 10.2083V21.2333C4.66667 25.9389 5.98889 30.2167 8.63333 34.0667C11.2778 37.9167 14.6222 40.4833 18.6667 41.7667Z" fill="#E9BACD"/>
              </svg>
              <h3 className="text-white font-bold text-xl leading-7 mb-2">Salon Terverifikasi</h3>
              <p className="text-white/90 text-sm leading-[1.625]">
                Bekerja sama dengan mitra yang memiliki standar kualitas dan kebersihan tinggi.
              </p>
            </div>
          </div>

          {/* Bento Item 3 - bottom right, yellow */}
          <div
            className="md:col-span-1 lg:col-span-4 rounded-[32px] flex flex-col justify-between gap-6 p-10 min-h-[280px] relative overflow-hidden group"
            style={{ boxShadow: "0 10px 40px -12px rgba(0, 0, 0, 0.08)" }}
          >
            <img src="https://images.unsplash.com/photo-1599733594230-6b823276abce?w=500&q=80" alt="Harga Transparan" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-[#EFE4A2]/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-white/30 backdrop-blur-[2px]"></div>

            <div className="w-12 h-12 rounded-[20px] bg-white flex items-center justify-center shadow-sm relative z-10">
              <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
                <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="#675F2B"/>
              </svg>
            </div>
            <div className="flex flex-col gap-2 relative z-10">
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
    <section className="bg-glowup-bg py-16 lg:py-20">
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
          <Link to="/user/jelajah" className="text-glowup-brand font-bold text-base leading-6 shrink-0 hover:underline">
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
                  <h4 className="text-[#1B1C1C] font-bold text-lg leading-7 group-hover:text-glowup-brand transition-colors truncate">
                    {salon.name}
                  </h4>
                  <p className="text-sm text-[#5E5F5B] line-clamp-1 mt-1">
                    {salon.address || "Lokasi belum tersedia"}
                  </p>
                  {salon.categories && salon.categories.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {salon.categories.slice(0, 2).map((c) => (
                        <span key={c.id} className="px-2 py-0.5 bg-glowup-pink-50 text-glowup-brand rounded-full text-[10px] font-semibold">
                          {c.name}
                        </span>
                      ))}
                      {salon.categories.length > 2 && (
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full text-[10px] font-semibold">
                          +{salon.categories.length - 2}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-gray-450 mt-4 border-t border-gray-50 pt-3">
                  <span>
                    {salon.open_time?.substring(0, 5) || "09:00"} - {salon.close_time?.substring(0, 5) || "21:00"}
                  </span>
                  <span className="text-glowup-brand font-bold group-hover:underline">Detail →</span>
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
    <section className="bg-glowup-bg py-16 lg:py-20 px-4">
      <div
        className="max-w-[1280px] mx-auto rounded-[32px] px-6 py-16 sm:py-20 flex flex-col items-center gap-8 bg-glowup-pink-50"
      >
        <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.2] tracking-[-0.5px] text-center max-w-xl">
          Siap Untuk Tampil Mempesona?
        </h2>
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link
            to="/register"
            className="w-full sm:w-auto text-center px-12 py-[17px] rounded-[20px] text-glowup-dark font-bold text-lg leading-7 bg-glow-gradient"
          >
            Mulai Sekarang
          </Link>
        </div>
      </div>
    </section>
  );
}

function PartnerSection() {
  return (
    <section className="bg-white py-16 lg:py-24 border-t border-[rgba(210,195,199,0.10)]">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
        <div className="flex-1 order-2 lg:order-1 relative">
          <div className="w-full aspect-[4/3] rounded-[32px] overflow-hidden relative z-10" style={{ boxShadow: "0 20px 40px -10px rgba(0,0,0,0.1)" }}>
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" alt="Salon Partner" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
              <div className="text-white">
                <h4 className="font-bold text-xl mb-1">Kembangkan Bisnis Anda</h4>
                <p className="text-sm text-white/80">Bergabung dengan 500+ salon lainnya</p>
              </div>
            </div>
          </div>
          {/* Decorative element */}
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-glowup-pink-100 rounded-full blur-2xl -z-10"></div>
          <div className="absolute -top-6 -right-6 w-32 h-32 bg-[#EFE4A2] rounded-full blur-2xl -z-10"></div>
        </div>
        
        <div className="flex-1 order-1 lg:order-2 flex flex-col gap-6">
          <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-[44px] leading-[1.2] tracking-[-0.5px]">
            Ingin salon Anda dipublikasikan?
          </h2>
          <p className="text-[#5E5F5B] text-base lg:text-lg leading-[1.6]">
            Tingkatkan jangkauan pelanggan dan mudahkan pengelolaan booking dengan bergabung menjadi mitra GlowUp. Kelola jadwal, layanan, dan ulasan pelanggan dalam satu dashboard yang modern.
          </p>
          
          <ul className="flex flex-col gap-4 mt-2">
            {[
              "Manajemen jadwal otomatis & anti-bentrok",
              "Akses ke ribuan pelanggan potensial setiap hari",
              "Sistem review terpercaya untuk reputasi bisnis",
              "Dashboard analitik lengkap"
            ].map((feature, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-glowup-pink-100 text-glowup-brand flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[#1B1C1C] font-medium">{feature}</span>
              </li>
            ))}
          </ul>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-[20px] bg-green-500 text-white font-bold hover:bg-green-600 transition-colors shadow-lg shadow-green-500/30">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
              Hubungi via WhatsApp
            </a>
            <a href="mailto:mitra@glowup.com" className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-[20px] bg-white border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
              Email Kami
            </a>
          </div>
        </div>
      </div>
    </section>
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
    <div className="min-h-screen bg-glowup-bg">
      <PublicNavbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <SalonsSection salons={salons} loading={loading} />
        <PartnerSection />
        <CTASection />
      </main>
      <PublicFooter />
    </div>
  );
}
