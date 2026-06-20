import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { PublicNavbar, PublicFooter } from "../components/PublicLayout";

/* ────────────────────────────────────────────────────────────────────────
   DESIGN NOTES (kept here intentionally so future edits stay consistent)

   Palette is untouched — glowup-brand (#795465), glowup-dark (#2E1221),
   glowup-bg, glowup-pink-50/100, glow-gradient (#F8C8DC → #EFE4A2).

   What changed:
   - Type scale is now deliberate: one display weight for headlines, one
     quieter weight for body copy, consistent tracking/line-height pairs
     reused everywhere instead of one-off values per section.
   - Section rhythm standardized to a single vertical cadence (py-24 / py-28)
     instead of mismatched py-16/py-20 jumps.
   - Hero search bar reworked as a real interactive component (controlled
     inputs + focus states) instead of static decoration.
   - Feature "bento" replaced with a calmer 3-up grid that uses one accent
     (the brand mauve number mark) as the signature device, rather than three
     different glass/overlay treatments competing for attention.
   - Salon cards unified into one card system shared by the salon grid —
     consistent radius, consistent shadow scale (resting vs hover), and a
     proper empty/loading state with direction instead of a bare sentence.
   - Partner section copy tightened to plain, active-voice statements.
───────────────────────────────────────────────────────────────────────── */

function HeroSection() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/user/jelajah?search=${encodeURIComponent(query)}`);
    } else {
      navigate(`/user/jelajah`);
    }
  };

  return (
    <section 
      className="relative overflow-hidden min-h-[100dvh] flex items-center pt-20 pb-16 lg:pb-20"
    >
      {/* ambient brand glow, single accent, not decoration-for-decoration's-sake */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] w-[640px] h-[640px] rounded-full opacity-30 blur-3xl"
        style={{ background: "radial-gradient(circle, #F8C8DC 0%, transparent 70%)" }}
      />

      <div className="relative max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        {/* Left — copy + search */}
        <div className="lg:col-span-6 flex flex-col gap-8">
          <div className="flex flex-col gap-5">
            <span className="inline-flex w-fit items-center gap-2 px-4 py-1.5 rounded-full bg-glowup-pink-100 text-glowup-brand text-xs font-bold tracking-[0.08em] uppercase">
              Booking salon, tanpa ribet
            </span>

            <h1 className="text-[#1B1C1C] font-bold text-[44px] sm:text-[56px] lg:text-[64px] leading-[0.98] tracking-[-0.02em]">
              Tampil
              <br />
              <span className="text-glowup-brand">GlowUp</span>, mulai
              <br />
              dari satu ketuk.
            </h1>

            <p className="text-[#5E5F5B] text-lg font-normal leading-[1.65] max-w-[440px]">
              Bandingkan salon, lihat harga jujur, dan kunci jadwal favoritmu —
              semua dalam satu pencarian.
            </p>
          </div>

          {/* Search bar — now a real, controlled component */}
          <form
            onSubmit={handleSearch}
            className="w-full max-w-[560px] flex flex-col sm:flex-row items-stretch gap-2 bg-white p-2 rounded-[28px] sm:rounded-[32px]"
            style={{
              border: "1px solid rgba(121,84,101,0.10)",
              boxShadow: "0 20px 45px -20px rgba(46,18,33,0.25)",
            }}
          >
            <label className="flex items-center gap-3 flex-1 px-4 py-3 rounded-[22px] focus-within:bg-glowup-pink-50 transition-colors">
              <svg width="16" height="20" viewBox="0 0 16 20" fill="none" className="shrink-0">
                <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#795465" fillOpacity="0.55" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari salon atau lokasi..."
                className="w-full bg-transparent outline-none text-[#1B1C1C] placeholder:text-[#8A8682] text-sm sm:text-base"
              />
            </label>

            <button
              type="submit"
              className="shrink-0 px-8 py-3.5 rounded-[22px] text-glowup-dark font-bold text-base leading-6 bg-glow-gradient hover:brightness-[1.03] active:brightness-95 transition"
            >
              Cari Salon
            </button>
          </form>


        </div>

        {/* Right — hero visual, simplified to one frame + one floating card
            instead of two competing floating elements */}
        <div className="lg:col-span-6">
          <div className="relative max-w-[520px] mx-auto lg:ml-auto lg:mr-0">
            <div
              className="w-full aspect-[4/5] rounded-[32px] overflow-hidden"
              style={{ boxShadow: "0 30px 60px -20px rgba(46,18,33,0.35)" }}
            >
              <img
                src="https://api.builder.io/api/v1/image/assets/TEMP/d98eec8b0febc9b0dd9f5bd7796bd46611f919be?width=1072"
                alt="Interior salon kecantikan"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="absolute -bottom-7 left-1/2 -translate-x-1/2 w-[88%] flex items-center justify-between gap-4 px-6 py-5 rounded-[22px] bg-white"
              style={{ boxShadow: "0 20px 45px -15px rgba(46,18,33,0.3)" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-full bg-glowup-pink-50 flex items-center justify-center shrink-0">
                  <svg width="18" height="17" viewBox="0 0 17 16" fill="none">
                    <path d="M3.1875 15.8333L4.54167 9.97917L0 6.04167L6 5.52083L8.33333 0L10.6667 5.52083L16.6667 6.04167L12.125 9.97917L13.4792 15.8333L8.33333 12.7292L3.1875 15.8333Z" fill="#795465" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="text-glowup-brand font-bold text-base leading-tight">4.9 dari 5</span>
                  <span className="text-[#8A8682] text-xs">2.300+ ulasan</span>
                </div>
              </div>
              <Link to="/user/jelajah" className="text-glowup-brand text-sm font-bold whitespace-nowrap hover:underline">
                Jelajahi →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FEATURES = [
  {
    mark: "01",
    title: "Reservasi Instan",
    body: "Pilih ketersediaan slot secara real-time dan konfirmasi jadwal Anda dalam hitungan detik—memberikan pengalaman tanpa hambatan yang dirancang untuk kenyamanan Anda.",
  },
  {
    mark: "02",
    title: "Salon terverifikasi",
    body: "Setiap mitra melewati pengecekan standar kebersihan dan kualitas sebelum tampil di GlowUp.",
  },
  {
    mark: "03",
    title: "Harga transparan",
    body: "Daftar harga lengkap terlihat sebelum kamu booking. Tidak ada biaya tersembunyi di akhir.",
  },
];

function FeaturesSection() {
  return (
    <section className="bg-glowup-bg pt-24 pb-12 lg:pt-28 lg:pb-14">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col mb-6 max-w-xl">
          <span className="text-glowup-brand text-xs font-bold tracking-[0.1em] uppercase">
            Keunggulan Platform
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-[rgba(121,84,101,0.10)] rounded-[28px] overflow-hidden">
          {FEATURES.map((f) => (
            <div key={f.mark} className="bg-white p-9 lg:p-10 flex flex-col gap-5">
              <span className="text-glowup-brand/40 font-bold text-3xl leading-none tracking-tight">
                {f.mark}
              </span>
              <h3 className="text-[#1B1C1C] font-bold text-xl leading-7">{f.title}</h3>
              <p className="text-[#5E5F5B] text-[15px] leading-[1.7]">{f.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const getMinPrice = (salon) => {
  if (salon.services && salon.services.length > 0) {
    return Math.min(...salon.services.map(s => s.price));
  }
  return 0;
};

function SalonCard({ salon }) {
  return (
    <Link
      to={`/user/salon/${salon.id}`}
      className="group flex flex-col bg-white rounded-[22px] overflow-hidden transition-all duration-300"
      style={{
        border: "1px solid rgba(121,84,101,0.08)",
        boxShadow: "0 4px 16px -8px rgba(46,18,33,0.08)",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 16px 32px -12px rgba(46,18,33,0.18)")}
      onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px -8px rgba(46,18,33,0.08)")}
    >
      <div className="w-full aspect-[4/3] overflow-hidden bg-glowup-pink-50">
        <img
          src={salon.image_url || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=540&q=80"}
          alt={salon.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>

      <div className="flex flex-col gap-2 p-5 flex-1">
        <h4 className="text-[#1B1C1C] font-bold text-base leading-6 truncate group-hover:text-glowup-brand transition-colors">
          {salon.name}
        </h4>
        <p className="text-sm text-[#8A8682] line-clamp-1">
          {salon.address || "Lokasi belum tersedia"}
        </p>

        {salon.categories?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {salon.categories.slice(0, 2).map((c) => (
              <span key={c.id} className="px-2.5 py-1 rounded-full bg-glowup-pink-50 text-glowup-brand text-[11px] font-semibold">
                {c.name}
              </span>
            ))}
            {salon.categories.length > 2 && (
              <span className="px-2.5 py-1 rounded-full bg-[#F4F1EE] text-[#8A8682] text-[11px] font-semibold">
                +{salon.categories.length - 2}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-[rgba(121,84,101,0.08)]">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Mulai dari</span>
            <span className="text-[#1B1C1C] font-bold text-sm">
              {getMinPrice(salon) ? `Rp ${Number(getMinPrice(salon)).toLocaleString("id-ID")}` : "Hubungi salon"}
            </span>
          </div>
          <span className="text-glowup-brand text-xs font-bold group-hover:translate-x-0.5 transition-transform">
            Lihat detail →
          </span>
        </div>
      </div>
    </Link>
  );
}

function SalonsSection({ salons, loading }) {
  return (
    <section className="bg-glowup-bg pt-12 pb-24 lg:pt-14 lg:pb-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5 mb-12">
          <div className="flex flex-col gap-3">
            <span className="text-glowup-brand text-xs font-bold tracking-[0.1em] uppercase">
              Pilihan terpopuler
            </span>
            <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.01em]">
              Salon Pilihan Pelanggan
            </h2>
          </div>
          <Link to="/user/jelajah" className="text-glowup-brand font-bold text-sm shrink-0 hover:underline">
            Lihat semua salon →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="rounded-[22px] overflow-hidden border border-[rgba(121,84,101,0.08)]">
                <div className="w-full aspect-[4/3] bg-glowup-pink-50 animate-pulse" />
                <div className="p-5 flex flex-col gap-3">
                  <div className="h-4 w-3/4 bg-[#F4F1EE] rounded animate-pulse" />
                  <div className="h-3 w-1/2 bg-[#F4F1EE] rounded animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : salons.length === 0 ? (
          <div className="flex flex-col items-center text-center gap-3 py-20 px-6 rounded-[28px] bg-white border border-dashed border-[rgba(121,84,101,0.2)]">
            <span className="text-[#1B1C1C] font-bold text-lg">Belum ada salon terdaftar</span>
            <p className="text-[#8A8682] text-sm max-w-sm">
              Salon mitra baru akan tampil di sini segera. Sementara itu, kamu bisa menjelajahi kategori layanan yang tersedia.
            </p>
            <Link to="/user/jelajah" className="mt-2 px-6 py-2.5 rounded-full bg-glowup-pink-50 text-glowup-brand text-sm font-bold hover:bg-glowup-pink-100 transition-colors">
              Jelajahi Salon
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {salons.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PartnerSection() {
  const benefits = [
    "Jadwal otomatis, tanpa bentrok",
    "Akses ke ribuan pelanggan baru tiap hari",
    "Ulasan terverifikasi untuk reputasi salon",
    "Dashboard analitik dalam satu tempat",
  ];

  return (
    <section className="py-24 lg:py-28">
      <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative order-2 lg:order-1">
          <div className="w-full aspect-[4/3] rounded-[28px] overflow-hidden" style={{ boxShadow: "0 25px 50px -20px rgba(46,18,33,0.25)" }}>
            <img src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80" alt="Pemilik salon mitra GlowUp" className="w-full h-full object-cover" />
          </div>
        </div>

        <div className="lg:col-span-7 order-1 lg:order-2 flex flex-col gap-7">
          <h2 className="text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-[40px] leading-[1.15] tracking-[-0.01em] max-w-lg">
            Tingkatkan Potensi Bisnis Salon Anda.
          </h2>
          <p className="text-[#5E5F5B] text-base lg:text-lg leading-[1.65] max-w-lg">
            Bergabunglah menjadi mitra GlowUp dan nikmati sistem manajemen cerdas untuk mengoptimalkan operasional serta memperluas jangkauan pelanggan Anda tanpa kerumitan manual.
          </p>

          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-start gap-3">
                <div className="w-5 h-5 rounded-full bg-glowup-pink-100 text-glowup-brand flex items-center justify-center shrink-0 mt-0.5">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                <span className="text-[#1B1C1C] text-sm font-medium leading-6">{b}</span>
              </li>
            ))}
          </ul>

          <div className="flex flex-col sm:flex-row gap-3 mt-3">
            <a
              href="https://wa.me/6281234567890"
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-[18px] text-glowup-dark font-bold text-sm bg-glow-gradient hover:brightness-[1.03] transition"
            >
              Daftar via WhatsApp
            </a>
            <a
              href="mailto:mitra@glowup.com"
              className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-[18px] border border-[rgba(121,84,101,0.2)] text-[#1B1C1C] font-bold text-sm hover:bg-glowup-pink-50 transition-colors"
            >
              Email Tim Mitra
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-glowup-bg pb-24 lg:pb-28 px-6">
      <div className="max-w-[1280px] mx-auto rounded-[32px] px-8 py-16 sm:py-20 flex flex-col items-center gap-7 bg-gradient-to-br from-[#F8C8DC] to-[#EFE4A2] text-center relative overflow-hidden">
        <h2 className="relative text-[#1B1C1C] font-bold text-3xl sm:text-4xl lg:text-5xl leading-[1.15] tracking-[-0.01em] max-w-xl">
          Siap untuk tampil mempesona?
        </h2>
        <p className="relative text-[#4E4715] text-base max-w-md font-medium">
          Buat akun dan booking salon pertamamu hari ini.
        </p>
        <Link
          to="/register"
          className="relative px-12 py-4 mt-2 rounded-[18px] text-[#1B1C1C] font-bold text-base bg-white hover:bg-opacity-90 active:scale-95 transition-all shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)]"
        >
          Mulai Sekarang
        </Link>
      </div>
    </section>
  );
}

export default function Index() {
  const { isAuthenticated } = useAuth();
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);

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

  if (isAuthenticated) {
    return <Navigate to="/user/beranda" replace />;
  }

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
