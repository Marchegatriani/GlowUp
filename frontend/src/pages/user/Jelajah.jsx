import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";
import { SearchIcon, StarIcon } from "../../components/icons";

const ITEMS_PER_PAGE = 6; // Set to 6 to fit nicely in 3 columns

// Data enrichment helpers to populate fields missing from db
const getRating = (salon) => {
  return salon.rating || 0.0;
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
  if (salon.services && salon.services.length > 0) {
    return Math.min(...salon.services.map(s => s.price));
  }
  return 0;
};

export default function Jelajah() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter and Search states
  const [search, setSearch] = useState("");
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
  }, [search, maxPrice, selectedRatings, selectedCategory]);

  const filteredSalons = salons.filter((salon) => {
    // 1. Search text filter (name or address)
    const matchesSearch =
      salon.name.toLowerCase().includes(search.toLowerCase()) ||
      (salon.address && salon.address.toLowerCase().includes(search.toLowerCase()));

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

    return matchesSearch && matchesPrice && matchesRating && matchesCategory;
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
    </div>
  );
}
