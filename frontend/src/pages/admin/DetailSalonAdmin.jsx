import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function DetailSalonAdmin() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    const fetchSalonAndReviews = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch admin-only salon details (which includes owner info)
        const salonRes = await axiosClient.get(`/salons/${id}/admin`);
        setSalon(salonRes.data);

        // Fetch reviews
        const reviewsRes = await axiosClient.get(`/salons/${id}/reviews`);
        setReviews(reviewsRes.data);
      } catch (err) {
        console.error("Gagal memuat detail salon:", err);
        setError("Gagal memuat detail salon atau ulasan.");
      } finally {
        setLoading(false);
      }
    };

    fetchSalonAndReviews();
  }, [id]);

  const handleToggleStatus = async () => {
    setError(null);
    setSuccess(null);
    try {
      const response = await axiosClient.put(`/salons/${id}/status`);
      setSuccess(response.data.message);
      setSalon((prev) => ({ ...prev, is_active: response.data.is_active }));
    } catch (err) {
      console.error("Gagal mengubah status salon:", err);
      setError("Gagal mengubah status salon.");
    }
  };

  const handleDeleteSalon = async () => {
    setError(null);
    try {
      await axiosClient.delete(`/salons/${id}`);
      navigate("/admin/salons", { state: { successMessage: `Salon "${salon.name}" berhasil dihapus.` } });
    } catch (err) {
      console.error("Gagal menghapus salon:", err);
      setError("Gagal menghapus salon.");
      setShowDeleteModal(false);
    }
  };

  const getRatingAverage = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <svg
        key={i}
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill={i < rating ? "#EAB308" : "none"}
        stroke="#EAB308"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="shrink-0"
      >
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ));
  };

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Back link */}
      <div>
        <Link
          to="/admin/salons"
          className="text-sm font-bold text-[#8B6B7A] hover:text-[#795465] transition-colors flex items-center gap-1.5"
        >
          ← Kembali ke Kelola Salon
        </Link>
      </div>

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

      {loading ? (
        <div className="py-20 text-center text-gray-500 font-medium">
          Memuat detail salon...
        </div>
      ) : !salon ? (
        <div className="py-20 text-center text-gray-500 font-medium">
          Detail salon tidak ditemukan.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Info */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Salon Banner Card */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
              <div className="h-64 sm:h-96 relative bg-gray-100">
                <img
                  src={salon.image_url || `https://api.builder.io/api/v1/image/assets/TEMP/${salon.id % 2 === 0 ? "4295490d2b008bb111491f419e44fca5db04c803" : "f522a522b78a02f7f219e665307f41b3cc812db9"}?width=1000`}
                  alt={salon.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-6 right-6">
                  <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${
                    salon.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                  }`}>
                    {salon.is_active ? "Aktif" : "Nonaktif"}
                  </span>
                </div>
              </div>

              <div className="p-8 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="flex flex-col gap-2">
                    <h2 className="text-[#1B1C1C] font-extrabold text-3xl tracking-tight">
                      {salon.name}
                    </h2>
                    <p className="text-gray-500 text-sm flex items-center gap-1.5">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" />
                      </svg>
                      {salon.address}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-100 px-4 py-2 rounded-2xl">
                    <span className="text-yellow-600 font-extrabold text-lg">{getRatingAverage()}</span>
                    <div className="flex">{renderStars(Math.round(getRatingAverage()))}</div>
                    <span className="text-gray-400 text-xs font-medium">({reviews.length} Ulasan)</span>
                  </div>
                </div>

                <div className="border-t border-gray-50 pt-4 mt-2">
                  <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-2">Deskripsi Salon</h3>
                  <p className="text-gray-650 text-base leading-7 whitespace-pre-line">
                    {salon.description || "Tidak ada deskripsi yang disediakan."}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-6">
              <h3 className="text-gray-800 text-lg font-bold">Ulasan & Rating Pelanggan</h3>
              
              {reviews.length === 0 ? (
                <p className="text-gray-500 text-sm">Belum ada ulasan untuk salon ini.</p>
              ) : (
                <div className="flex flex-col gap-6">
                  {reviews.map((r, i) => (
                    <div key={r.id} className={`flex flex-col gap-3 py-4 ${i > 0 ? "border-t border-gray-50" : ""}`}>
                      <div className="flex justify-between items-start gap-4">
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-gray-800">{r.user?.name || "Pelanggan GlowUp"}</span>
                          <span className="text-xs text-gray-400">
                            {r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID", { dateStyle: "medium" }) : ""}
                          </span>
                        </div>
                        <div className="flex">{renderStars(r.rating)}</div>
                      </div>
                      <p className="text-gray-600 text-sm leading-6 italic">
                        "{r.comment || "Tidak ada komentar."}"
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

          {/* Sidebar Info & Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Owner Details Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-5">
              <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider">Informasi Pemilik</h3>
              
              <div className="flex flex-col gap-3 border-t border-gray-50 pt-3">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Nama Owner</span>
                  <span className="text-sm text-gray-800 font-bold mt-0.5">{salon.owner?.name}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Email</span>
                  <span className="text-sm text-gray-800 font-medium mt-0.5">{salon.owner?.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Telepon Salon</span>
                  <span className="text-sm text-gray-800 font-medium mt-0.5">{salon.phone_number}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Jam Operasional</span>
                  <span className="text-sm text-gray-800 font-semibold mt-0.5">
                    {salon.open_time} - {salon.close_time}
                  </span>
                </div>
              </div>
            </div>

            {/* Moderation Controls Card */}
            <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col gap-4">
              <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-2">Panel Moderasi</h3>
              
              {/* Toggle Status */}
              <button
                onClick={handleToggleStatus}
                className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all border shadow-sm flex justify-center items-center gap-2 ${
                  salon.is_active
                    ? "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100"
                    : "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100"
                }`}
              >
                {salon.is_active ? (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                    Nonaktifkan Salon
                  </>
                ) : (
                  <>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L21 2" />
                    </svg>
                    Aktifkan Salon
                  </>
                )}
              </button>

              {/* Delete Salon */}
              <button
                onClick={() => setShowDeleteModal(true)}
                className="w-full py-3.5 rounded-xl font-bold text-sm bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all flex justify-center items-center gap-2"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="3 6 5 6 21 6" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Hapus Salon
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
            <h3 className="text-xl font-bold text-gray-800">Hapus Mitra Salon</h3>
            <p className="text-sm text-gray-500">
              Apakah Anda yakin ingin menghapus salon <strong>{salon?.name}</strong> secara permanen dari sistem? Ini akan menghapus semua ulasan, booking, dan status operasional salon ini.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
              >
                Batal
              </button>
              <button
                onClick={handleDeleteSalon}
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
