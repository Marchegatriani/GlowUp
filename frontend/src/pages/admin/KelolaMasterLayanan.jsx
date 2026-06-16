import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function KelolaMasterLayanan() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/services/");
      setServices(response.data);
    } catch (err) {
      console.error("Gagal mengambil master layanan:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.post("/services/", {
        name,
        description: description || null,
      });
      setSuccess(`Layanan "${name}" berhasil ditambahkan ke daftar master!`);
      setName("");
      setDescription("");
      setShowModal(false);
      fetchServices(); // Refresh list
    } catch (err) {
      console.error("Gagal membuat master layanan:", err);
      setError(err.response?.data?.detail || "Gagal menambahkan layanan.");
    }
  };

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
            Master Layanan
          </h1>
          <p className="text-[#5E5F5B] text-base font-normal leading-6">
            Daftar jenis perawatan kecantikan umum yang dapat digunakan oleh Salon.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
          style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
        >
          Tambah Master Layanan
        </button>
      </header>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <p className="text-gray-500 font-medium">Memuat master layanan...</p>
        </div>
      ) : services.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 text-center">
          <p className="text-gray-500 font-medium mb-2">Belum ada master layanan terdaftar.</p>
          <button
            onClick={() => setShowModal(true)}
            className="text-sm font-bold text-[#8B6B7A] hover:underline"
          >
            Buat layanan pertama sekarang
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((svc) => (
            <div
              key={svc.id}
              className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-8 flex flex-col gap-3 min-h-[140px] justify-between"
            >
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-gray-800">{svc.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {svc.description || "Tidak ada deskripsi layanan."}
                </p>
              </div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                ID LAYANAN: #{svc.id}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Tambah Master Layanan</h3>
                <p className="text-xs text-gray-500 mt-1">Buat template layanan baru untuk sistem.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Layanan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Haircut, Creambath, Manicure"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Deskripsi Layanan</label>
                <textarea
                  placeholder="Berikan penjelasan singkat mengenai jenis perawatan ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="4"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors resize-none"
                />
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm"
                  style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
                >
                  Buat Layanan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
