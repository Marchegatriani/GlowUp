import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function KelolaSalonAdmin() {
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Deletion modal states
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [salonToDelete, setSalonToDelete] = useState(null);

  const fetchSalons = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosClient.get("/salons/admin/list");
      setSalons(response.data);
    } catch (err) {
      console.error("Gagal memuat daftar salon:", err);
      setError("Gagal memuat daftar salon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSalons();
  }, []);

  const handleToggleStatus = async (salonId) => {
    setError(null);
    setSuccess(null);
    try {
      const response = await axiosClient.put(`/salons/${salonId}/status`);
      setSuccess(response.data.message);
      // Update local state directly to be fast & responsive
      setSalons((prev) =>
        prev.map((s) => (s.id === salonId ? { ...s, is_active: response.data.is_active } : s))
      );
    } catch (err) {
      console.error("Gagal mengubah status salon:", err);
      setError("Gagal mengubah status salon.");
    }
  };

  const handleDeleteClick = (salon) => {
    setSalonToDelete(salon);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!salonToDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.delete(`/salons/${salonToDelete.id}`);
      setSuccess(`Salon "${salonToDelete.name}" berhasil dihapus.`);
      setSalons((prev) => prev.filter((s) => s.id !== salonToDelete.id));
      setShowDeleteModal(false);
      setSalonToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus salon:", err);
      setError("Gagal menghapus salon.");
    }
  };

  // Filter and search
  const filteredSalons = salons.filter((salon) => {
    const matchesSearch =
      salon.name.toLowerCase().includes(search.toLowerCase()) ||
      salon.owner_name.toLowerCase().includes(search.toLowerCase()) ||
      salon.address.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && salon.is_active) ||
      (statusFilter === "inactive" && !salon.is_active);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col gap-2">
        <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
          Kelola Mitra Salon
        </h1>
        <p className="text-[#5E5F5B] text-base font-normal leading-6">
          Daftar seluruh salon yang terdaftar di platform GlowUp. Lakukan aktivasi, penonaktifan, atau moderasi salon.
        </p>
      </header>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Toolbar (Search & Filter) */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] w-full">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari salon, owner, lokasi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#8B6B7A] transition-colors bg-gray-50"
          />
          <svg
            className="absolute left-3.5 top-3.5 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-[#8B6B7A] transition-colors bg-gray-50"
          >
            <option value="all">Semua Status</option>
            <option value="active">Aktif</option>
            <option value="inactive">Nonaktif</option>
          </select>
        </div>
      </div>

      {/* Salons Table */}
      <div className="glass-card rounded-[24px] overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Salon</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Pemilik (Owner)</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Alamat / Lokasi</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">Memuat data salon...</td>
                </tr>
              ) : filteredSalons.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">Tidak ada salon yang cocok.</td>
                </tr>
              ) : (
                filteredSalons.map((salon, idx) => (
                  <tr key={salon.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                    <td className="px-8 py-6 text-sm font-bold text-gray-450 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    <td className="px-8 py-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                      {salon.name}
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-gray-600 whitespace-nowrap">
                      {salon.owner_name}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 max-w-[240px] truncate">
                      {salon.address}
                    </td>
                    <td className="px-8 py-6 text-center whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                        salon.is_active ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-600 border border-red-100"
                      }`}>
                        {salon.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center flex items-center justify-center gap-3">
                      <Link
                        to={`/admin/salons/${salon.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#8B6B7A] text-white hover:bg-[#795465] transition-all inline-block shadow-sm"
                      >
                        Detail
                      </Link>
                      <button
                        onClick={() => handleToggleStatus(salon.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                          salon.is_active
                            ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                            : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                        }`}
                      >
                        {salon.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(salon)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && salonToDelete && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-gray-800">Hapus Kemitraan Salon</h3>
            <p className="text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus salon <strong>{salonToDelete.name}</strong> milik <strong>{salonToDelete.owner_name}</strong> secara permanen dari platform? Tindakan ini tidak dapat dibatalkan.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all shadow-sm"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
