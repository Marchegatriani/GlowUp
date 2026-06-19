import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { SearchIcon, StarIcon } from "../../components/icons";

const ITEMS_PER_PAGE = 6; // Set to 6 to fit nicely in 3 columns

// Data enrichment helpers to populate fields missing from db
const getRating = (salon) => {
  if (salon.name.toLowerCase().includes("ethereal")) return 4.9;
  if (salon.name.toLowerCase().includes("velvet")) return 4.8;
  if (salon.name.toLowerCase().includes("glow sanctuary")) return 4.7;
  if (salon.name.toLowerCase().includes("crown")) return 5.0;
  // Fallback based on ID to make it deterministic
  const ratings = [4.5, 4.6, 4.7, 4.8, 4.9, 5.0];
  return ratings[salon.id % ratings.length];
};

const getCategory = (salon) => {
  if (salon.name.toLowerCase().includes("ethereal")) return "Premium Haircut";
  if (salon.name.toLowerCase().includes("velvet")) return "Nail & Spa";
  if (salon.name.toLowerCase().includes("glow sanctuary")) return "Facial & Skin";
  if (salon.name.toLowerCase().includes("crown")) return "Hair Styling";
  // Fallback based on ID
  const categories = ["Premium Haircut", "Nail & Spa", "Facial & Skin", "Hair Styling"];
  return categories[salon.id % categories.length];
};

const getMinPrice = (salon) => {
  if (salon.name.toLowerCase().includes("ethereal")) return 450000;
  if (salon.name.toLowerCase().includes("velvet")) return 250000;
  if (salon.name.toLowerCase().includes("glow sanctuary")) return 600000;
  if (salon.name.toLowerCase().includes("crown")) return 350000;
  // Fallback based on ID
  const prices = [150000, 200000, 250000, 300000, 350000, 400000, 450000, 500000, 600000];
  return prices[salon.id % prices.length];
};

export default function Jelajah() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and Search states
  const [search, setSearch] = useState("");
  const [selectedLokasi, setSelectedLokasi] = useState("Semua Lokasi");
  const [maxPrice, setMaxPrice] = useState(1000000);
  const [selectedRatings, setSelectedRatings] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  
  // Sorting and Pagination states
  const [sortBy, setSortBy] = useState("popularitas");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchSalons = async () => {
      try {
        const response = await axiosClient.get("/salons");
        setSalons(response.data);
      } catch (error) {
        console.error("Gagal memuat salon:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchSalons();
  }, []);

  // Reset pagination on filter change
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedLokasi, maxPrice, selectedRatings, selectedCategory]);

  const filteredSalons = salons.filter((salon) => {
    // 1. Search text filter (name or address)
    const matchesSearch =
      salon.name.toLowerCase().includes(search.toLowerCase()) ||
      (salon.address && salon.address.toLowerCase().includes(search.toLowerCase()));

    // 2. Location filter
    const matchesLocation =
      selectedLokasi === "Semua Lokasi" ||
      (salon.address && salon.address.toLowerCase().includes(selectedLokasi.toLowerCase()));

    // 3. Price filter
    const price = getMinPrice(salon);
    const matchesPrice = price <= maxPrice;

    // 4. Rating filter
    const rating = getRating(salon);
    let matchesRating = true;
    if (selectedRatings.length > 0) {
      const minVal = Math.min(...selectedRatings.map(r => parseFloat(r)));
      matchesRating = rating >= minVal;
    }

    // 5. Category filter
    const category = getCategory(salon);
    let matchesCategory = true;
    if (selectedCategory) {
      if (selectedCategory === "Rambut") {
        matchesCategory = category === "Premium Haircut" || category === "Hair Styling";
      } else if (selectedCategory === "Kuku") {
        matchesCategory = category === "Nail & Spa" || category === "Nail Art";
      } else if (selectedCategory === "Wajah") {
        matchesCategory = category === "Facial & Skin" || category === "Facial";
      } else if (selectedCategory === "Spa") {
        matchesCategory = category === "Nail & Spa" || category === "Body Spa & Massage";
      }
    }

    return matchesSearch && matchesLocation && matchesPrice && matchesRating && matchesCategory;
  });

  const sortedSalons = [...filteredSalons].sort((a, b) => {
    if (sortBy === "rating") return getRating(b) - getRating(a);
    if (sortBy === "harga") return getMinPrice(a) - getMinPrice(b);
    return 0; // popularitas / default
  });

  const totalPages = Math.max(1, Math.ceil(sortedSalons.length / ITEMS_PER_PAGE));
  const paginatedSalons = sortedSalons.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const formatRupiah = (value) =>
    value ? `Rp ${Number(value).toLocaleString("id-ID")}` : "Hubungi salon";

  return (
    <div className="bg-glowup-bg min-h-screen flex flex-col justify-between">
      {/* Main Content */}
      <main className="max-w-[1280px] w-full mx-auto px-6 sm:px-10 lg:px-16 py-12 flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-10">
          
          {/* Sidebar Filter */}
          <aside className="bg-white rounded-[24px] border border-gray-100 p-6 h-fit sticky top-24 flex flex-col gap-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.03)]">
            <h2 className="text-base font-bold text-gray-800">Filter</h2>

            {/* Location Select */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">LOKASI</label>
              <select 
                value={selectedLokasi}
                onChange={(e) => setSelectedLokasi(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 focus:outline-none focus:ring-2 focus:ring-glowup-brand"
              >
                <option value="Semua Lokasi">Semua Lokasi</option>
                <option value="Jakarta">Jakarta</option>
                <option value="Bandung">Bandung</option>
              </select>
            </div>

            {/* Price Range Slider */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">RENTANG HARGA</label>
              <input 
                type="range" 
                min="0" 
                max="1000000" 
                step="50000"
                value={maxPrice}
                onChange={(e) => setMaxPrice(Number(e.target.value))}
                className="w-full accent-glowup-brand cursor-pointer" 
              />
              <div className="flex justify-between text-xs text-gray-400">
                <span>Rp 0</span>
                <span>Rp {maxPrice >= 1000000 ? "1jt+" : maxPrice.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {/* Rating Filter checkboxes */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">RATING MINIMAL</label>
              {["4.5", "4.0"].map((r) => (
                <label key={r} className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="accent-glowup-brand" 
                    checked={selectedRatings.includes(r)}
                    onChange={() => {
                      if (selectedRatings.includes(r)) {
                        setSelectedRatings(selectedRatings.filter(x => x !== r));
                      } else {
                        setSelectedRatings([...selectedRatings, r]);
                      }
                    }}
                  />
                  <span>{r}+</span>
                  <StarIcon className="w-3 h-3 text-[#EAB308]" />
                </label>
              ))}
            </div>

            {/* Category Filter Tags */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-gray-700">KATEGORI LAYANAN</label>
              <div className="flex flex-wrap gap-2">
                {["Rambut", "Kuku", "Wajah", "Spa"].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? "" : cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                      selectedCategory === cat
                        ? "bg-glowup-brand text-white border-glowup-brand"
                        : "bg-white text-gray-600 border-gray-200 hover:border-glowup-brand"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <div className="flex flex-col gap-8">
            
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold text-gray-800">Jelajahi Salon</h1>
                <p className="text-gray-500 text-base max-w-lg">
                  Temukan {sortedSalons.length} salon premium terbaik dengan layanan berkualitas tinggi.
                </p>
              </div>

              <div className="flex flex-col gap-3 items-start md:items-end w-full md:w-auto">
                {/* Search input */}
                <div className="relative w-full md:w-80">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <SearchIcon className="w-5 h-5" />
                  </div>
                  <input
                    type="text"
                    placeholder="Cari nama salon atau lokasi..."
                    className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-glowup-brand focus:border-transparent transition-all"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Urutkan:</span>
                  {[
                    { key: "popularitas", label: "Popularitas" },
                    { key: "rating", label: "Rating" },
                    { key: "harga", label: "Harga" },
                  ].map((opt) => (
                    <button
                      key={opt.key}
                      onClick={() => setSortBy(opt.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                        sortBy === opt.key
                          ? "bg-glowup-brand text-white"
                          : "bg-white border border-gray-200 text-gray-600 hover:border-glowup-brand"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Salon Grid */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 font-medium">Memuat data salon...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedSalons.length > 0 ? (
                  paginatedSalons.map((salon) => (
                    <Link
                      to={`/user/salon/${salon.id}`}
                      key={salon.id}
                      className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all group flex flex-col justify-between"
                    >
                      <div>
                        {/* Salon Image */}
                        <div className="h-44 bg-gray-200 relative overflow-hidden">
                          <img
                            src={
                              salon.image_url ||
                              (salon.id % 2 === 0
                                ? "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80"
                                : "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80")
                            }
                            alt={salon.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          {/* Rating badge */}
                          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                            <StarIcon className="w-3 h-3 text-[#EAB308]" />
                            <span className="text-xs font-bold text-gray-800">
                              {getRating(salon).toFixed(1)}
                            </span>
                          </div>
                        </div>

                        {/* Card details */}
                        <div className="p-5 flex flex-col gap-3">
                          <span className="text-[10px] font-bold tracking-wider text-glowup-brand uppercase">
                            {getCategory(salon)}
                          </span>
                          <div className="flex flex-col gap-1 -mt-1">
                            <h3 className="text-lg font-bold text-gray-800 truncate">{salon.name}</h3>
                            <p className="text-sm text-gray-500 line-clamp-1 flex items-center gap-1">
                              <svg width="12" height="15" viewBox="0 0 16 20" fill="none" className="text-glowup-brand shrink-0">
                                <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="currentColor"/>
                              </svg>
                              <span>{salon.address || "Lokasi belum tersedia"}</span>
                            </p>
                          </div>
                          <div className="h-px w-full bg-gray-100" />
                        </div>
                      </div>

                      {/* Footer detail and pricing */}
                      <div className="px-5 pb-5 pt-0 flex items-center justify-between">
                        <div className="flex flex-col">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Mulai dari</span>
                          <span className="text-sm font-bold text-gray-800">
                            {formatRupiah(getMinPrice(salon))}
                          </span>
                        </div>
                        <span className="bg-glowup-brand text-white text-xs font-semibold px-4 py-2 rounded-xl hover:bg-glowup-pink-600 transition-colors">
                          Detail
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full text-center py-20">
                    <p className="text-gray-500 font-medium">Tidak ada salon yang ditemukan.</p>
                  </div>
                )}
              </div>
            )}

            {/* Pagination controls */}
            {!loading && totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  ‹
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${
                      currentPage === page
                        ? "bg-glowup-brand text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 transition-colors"
                >
                  ›
                </button>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-[rgba(210,195,199,0.10)] mt-20">
        <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-10">
            {/* Brand Column */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
              <Link to="/" className="text-glowup-brand font-bold text-[28px] leading-[42px]">GlowUp</Link>
              <p className="text-[#5E5F5B] text-base leading-6 max-w-[320px]">
                Solusi terpercaya untuk reservasi salon kecantikan premium dan eksklusif di seluruh Indonesia. Rasakan kemudahan dalam setiap sentuhan.
              </p>
              {/* Social Icons */}
              <div className="flex items-center gap-4">
                {[
                  <svg key="megaphone" width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M8.33333 16.6667C7.18056 16.6667 6.09722 16.4479 5.08333 16.0104C4.06944 15.5729 3.1875 14.9792 2.4375 14.2292C1.6875 13.4792 1.09375 12.5972 0.65625 11.5833C0.21875 10.5694 0 9.48611 0 8.33333C0 7.18056 0.21875 6.09722 0.65625 5.08333C1.09375 4.06944 1.6875 3.1875 2.4375 2.4375C3.1875 1.6875 4.06944 1.09375 5.08333 0.65625C6.09722 0.21875 7.18056 0 8.33333 0C9.48611 0 10.5694 0.21875 11.5833 0.65625C12.5972 1.09375 13.4792 1.6875 14.2292 2.4375C14.9792 3.1875 15.5729 4.06944 16.0104 5.08333C16.4479 6.09722 16.6667 7.18056 16.6667 8.33333C16.6667 9.48611 16.4479 10.5694 16.0104 11.5833C15.5729 12.5972 14.9792 13.4792 14.2292 14.2292C13.4792 14.9792 12.5972 15.5729 11.5833 16.0104C10.5694 16.4479 9.48611 16.6667 8.33333 16.6667ZM7.5 14.9583V13.3333C7.04167 13.3333 6.64931 13.1701 6.32292 12.8438C5.99653 12.5174 5.83333 12.125 5.83333 11.6667V10.8333L1.83333 6.83333C1.79167 7.08333 1.75347 7.33333 1.71875 7.58333C1.68403 7.83333 1.66667 8.08333 1.66667 8.33333C1.66667 10.0139 2.21875 11.4861 3.32292 12.75C4.42708 14.0139 5.81944 14.75 7.5 14.9583ZM13.25 12.8333C13.8194 12.2083 14.2535 11.5104 14.5521 10.7396C14.8507 9.96875 15 9.16667 15 8.33333C15 6.97222 14.6215 5.72917 13.8646 4.60417C13.1076 3.47917 12.0972 2.66667 10.8333 2.16667V2.5C10.8333 2.95833 10.6701 3.35069 10.3438 3.67708C10.0174 4.00347 9.625 4.16667 9.16667 4.16667H7.5V5.83333C7.5 6.06944 7.42014 6.26736 7.26042 6.42708C7.10069 6.58681 6.90278 6.66667 6.66667 6.66667H5V8.33333H10C10.2361 8.33333 10.434 8.41319 10.5938 8.57292C10.7535 8.73264 10.8333 8.93056 10.8333 9.16667V11.6667H11.6667C12.0278 11.6667 12.3542 11.7743 12.6458 11.9896C12.9375 12.2049 13.1389 12.4861 13.25 12.8333Z" fill="#795465"/></svg>,
                  <svg key="globe" width="17" height="17" viewBox="0 0 17 17" fill="none"><path d="M7.83333 5.83333H14.5C14.125 4.875 13.5521 4.05208 12.7812 3.36458C12.0104 2.67708 11.125 2.19444 10.125 1.91667L7.83333 5.83333ZM5.91667 7.5L9.25 1.75C9.09722 1.72222 8.94444 1.70139 8.79167 1.6875C8.63889 1.67361 8.48611 1.66667 8.33333 1.66667C7.41667 1.66667 6.5625 1.84028 5.77083 2.1875C4.97917 2.53472 4.27778 3 3.66667 3.58333L5.91667 7.5ZM1.875 10H6.41667L3.08333 4.25C2.63889 4.81944 2.29167 5.44792 2.04167 6.13542C1.79167 6.82292 1.66667 7.55556 1.66667 8.33333C1.66667 8.625 1.68403 8.90625 1.71875 9.17708C1.75347 9.44792 1.80556 9.72222 1.875 10ZM6.54167 14.75L8.79167 10.8333H2.16667C2.54167 11.7917 3.11458 12.6146 3.88542 13.3021C4.65625 13.9896 5.54167 14.4722 6.54167 14.75ZM8.33333 15C9.25 15 10.1042 14.8264 10.8958 14.4792C11.6875 14.1319 12.3889 13.6667 13 13.0833L10.75 9.16667L7.41667 14.9167C7.56944 14.9444 7.71875 14.9653 7.86458 14.9792C8.01042 14.9931 8.16667 15 8.33333 15ZM13.5833 12.4167C14.0278 11.8472 14.375 11.2188 14.625 10.5312C14.875 9.84375 15 9.11111 15 8.33333C15 8.04167 14.9826 7.76042 14.9479 7.48958C14.9132 7.21875 14.8611 6.94444 14.7917 6.66667H10.25L13.5833 12.4167ZM8.33333 16.6667C7.19444 16.6667 6.11806 16.4479 5.10417 16.0104C4.09028 15.5729 3.20486 14.9757 2.44792 14.2188C1.69097 13.4618 1.09375 12.5764 0.65625 11.5625C0.21875 10.5486 0 9.47222 0 8.33333C0 7.18056 0.21875 6.10069 0.65625 5.09375C1.09375 4.08681 1.69097 3.20486 2.44792 2.44792C3.20486 1.69097 4.09028 1.69097 5.10417 0.65625C6.11806 0.21875 7.19444 0 8.33333 0C9.48611 0 10.566 0.21875 11.5729 0.65625C12.5799 1.09375 13.4618 1.69097 14.2188 2.44792C14.9757 3.20486 15.5729 4.08681 16.0104 5.09375C16.4479 6.10069 16.6667 7.18056 16.6667 8.33333C16.6667 9.47222 16.4479 10.5486 16.0104 11.5625C15.5729 12.5764 14.9757 13.4618 14.2188 14.2188C13.4618 14.9757 12.5799 15.5729 11.5729 16.0104C10.566 16.4479 9.48611 16.6667 8.33333 16.6667Z" fill="#795465"/></svg>,
                  <svg key="mail" width="15" height="17" viewBox="0 0 15 17" fill="none"><path d="M12.5 16.6667C11.8056 16.6667 11.2153 16.4236 10.7292 15.9375C10.2431 15.4514 10 14.8611 10 14.1667C10 14.0833 10.0208 13.8889 10.0625 13.5833L4.20833 10.1667C3.98611 10.375 3.72917 10.5382 3.4375 10.6562C3.14583 10.7743 2.83333 10.8333 2.5 10.8333C1.80556 10.8333 1.21528 10.5903 0.729167 10.1042C0.243056 9.61806 0 9.02778 0 8.33333C0 7.63889 0.243056 7.04861 0.729167 6.5625C1.21528 6.07639 1.80556 5.83333 2.5 5.83333C2.83333 5.83333 3.14583 5.89236 3.4375 6.01042C3.72917 6.12847 3.98611 6.29167 4.20833 6.5L10.0625 3.08333C10.0347 2.98611 10.0174 2.89236 10.0104 2.80208C10.0035 2.71181 10 2.61111 10 2.5C10 1.80556 10.2431 1.21528 10.7292 0.729167C11.2153 0.243056 11.8056 0 12.5 0C13.1944 0 13.7847 0.243056 14.2708 0.729167C14.7569 1.21528 15 1.80556 15 2.5C15 3.19444 14.7569 3.78472 14.2708 4.27083C13.7847 4.75694 13.1944 5 12.5 5C12.1667 5 11.8542 4.94097 11.5625 4.82292C11.2708 4.70486 11.0139 4.54167 10.7917 4.33333L4.9375 7.75C4.96528 7.84722 4.98264 7.94097 4.98958 8.03125C4.99653 8.12153 5 8.22222 5 8.33333C5 8.44444 4.99653 8.54514 4.98958 8.63542C4.98264 8.72569 4.96528 8.81944 4.9375 8.91667L10.7917 12.3333C11.0139 12.125 11.2708 11.9618 11.5625 11.8438C11.8542 11.7257 12.1667 11.6667 12.5 11.6667C13.1944 11.6667 13.7847 11.9097 14.2708 12.3958C14.7569 12.8819 15 13.4722 15 14.1667C15 14.8611 14.7569 15.4514 14.2708 15.9375C13.7847 16.4236 13.1944 16.6667 12.5 16.6667Z" fill="#795465"/></svg>,
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

            {/* Navigasi Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">LAYANAN</h4>
              <div className="flex flex-col gap-4">
                {["Reservasi Salon", "Home Service", "Voucher Hadiah", "Membership"].map((item) => (
                  <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glowup-brand transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Informasi Column */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">INFORMASI</h4>
              <div className="flex flex-col gap-4">
                {["Tentang Kami", "Kontak", "Karir", "FAQ"].map((item) => (
                  <Link key={item} to="#" className="text-[#5E5F5B] text-sm leading-5 hover:text-glowup-brand transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter Column */}
            <div className="sm:col-span-2 lg:col-span-4 flex flex-col gap-6">
              <h4 className="text-[#1B1C1C] font-bold text-xs leading-4 tracking-[0.6px] uppercase">LANGGANAN NEWSLETTER</h4>
              <p className="text-[#5E5F5B] text-sm leading-5">
                Dapatkan info promo dan update salon terbaru.
              </p>
              <div className="flex items-stretch gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="flex-1 px-5 py-[17px] rounded-[20px] bg-[#F6F3F2] text-[#6B7280] text-sm outline-none placeholder-[#6B7280] focus:ring-2 focus:ring-glowup-brand/30"
                />
                <button
                  className="w-14 h-14 rounded-[20px] bg-glowup-brand flex items-center justify-center shrink-0 hover:bg-[#6a4858] transition-colors shadow-md"
                >
                  <svg width="19" height="16" viewBox="0 0 19 16" fill="none">
                    <path d="M0 16V0L19 8L0 16ZM2 13L13.85 8L2 3V6.5L8 8L2 9.5V13ZM2 13V8V3V6.5V9.5V13Z" fill="white"/>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Footer */}
        <div className="border-t border-[rgba(210,195,199,0.10)] py-10 text-center">
          <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[#5E5F5B] text-[13px] font-medium leading-[19.5px] tracking-[0.325px]">
              © 2024 GlowUp. Semua Hak Dilindungi.
            </p>
            <div className="flex gap-6 text-[13px] font-medium">
              <Link to="#" className="text-[#5E5F5B] hover:text-glowup-brand">Kebijakan Privasi</Link>
              <Link to="#" className="text-[#5E5F5B] hover:text-glowup-brand">Syarat & Ketentuan</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
