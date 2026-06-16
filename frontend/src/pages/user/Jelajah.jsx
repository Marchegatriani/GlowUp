import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

import { SearchIcon, StarIcon } from "../../components/icons";

export default function Jelajah() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

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

  const filteredSalons = salons.filter((salon) =>
    salon.name.toLowerCase().includes(search.toLowerCase()) ||
    (salon.address && salon.address.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <>
      {/* Main Content */}
      <main className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-12 flex flex-col gap-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-bold text-gray-800">Jelajahi Salon</h1>
            <p className="text-gray-500 text-base max-w-lg">Temukan layanan perawatan terbaik dari salon terpercaya di dekat Anda.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon />
            </div>
            <input
              type="text"
              placeholder="Cari nama salon atau lokasi..."
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-200 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8B6B7A] focus:border-transparent transition-all"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        {/* Salon Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <p className="text-gray-500 font-medium">Memuat data salon...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredSalons.length > 0 ? (
              filteredSalons.map((salon) => (
                <Link
                  to={`/user/salon/${salon.id}`}
                  key={salon.id}
                  className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-10px_rgba(0,0,0,0.1)] transition-all group"
                >
                  {/* Dummy Image for now */}
                  <div className="h-48 bg-gray-200 relative overflow-hidden">
                    <img 
                      src={`https://api.builder.io/api/v1/image/assets/TEMP/${salon.id % 2 === 0 ? "4295490d2b008bb111491f419e44fca5db04c803" : "f522a522b78a02f7f219e665307f41b3cc812db9"}?width=600`}
                      alt={salon.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <StarIcon />
                      <span className="text-xs font-bold text-gray-800">4.8</span>
                    </div>
                  </div>
                  <div className="p-5 flex flex-col gap-3">
                    <div className="flex flex-col gap-1">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{salon.name}</h3>
                      <p className="text-sm text-gray-500 line-clamp-1">{salon.address || "Lokasi belum tersedia"}</p>
                    </div>
                    <div className="h-px w-full bg-gray-100 my-1" />
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500 truncate">{salon.open_time} - {salon.close_time}</span>
                      <span className="text-[#8B6B7A] font-medium hover:underline">Lihat Detail</span>
                    </div>
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
      </main>
    </>
  );
}
