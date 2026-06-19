import { useState, useEffect } from "react";
import axiosClient from "../../api/axiosClient";

const StarIcon = ({ filled, onClick, className = "w-5 h-5", interactive = false }) => (
  <svg
    onClick={interactive ? onClick : undefined}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill={filled ? "#EAB308" : "none"}
    stroke={filled ? "#EAB308" : "#9CA3AF"}
    strokeWidth="2"
    className={`${className} ${interactive ? "cursor-pointer transition-transform active:scale-90 hover:scale-105" : ""}`}
  >
    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
  </svg>
);

export default function RiwayatReview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  // States untuk Edit Modal
  const [editingReview, setEditingReview] = useState(null);
  const [editRating, setEditRating] = useState(5);
  const [editComment, setEditComment] = useState("");
  const [editError, setEditError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchReviews = async () => {
    try {
      const response = await axiosClient.get("/reviews/me");
      setReviews(response.data);
    } catch (error) {
      console.error("Failed to fetch reviews:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEditClick = (review) => {
    setEditingReview(review);
    setEditRating(review.rating);
    setEditComment(review.comment || "");
    setEditError(null);
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    setSaving(true);
    setEditError(null);
    try {
      const response = await axiosClient.put(`/reviews/${editingReview.id}`, {
        rating: editRating,
        comment: editComment
      });

      // Update local state
      setReviews(reviews.map((r) => r.id === editingReview.id ? { ...r, rating: response.data.rating, comment: response.data.comment } : r));
      setEditingReview(null);
    } catch (err) {
      console.error("Failed to update review:", err);
      setEditError(err.response?.data?.detail || "Gagal memperbarui ulasan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const confirmDelete = window.confirm("Apakah Anda yakin ingin menghapus ulasan ini secara permanen?");
    if (!confirmDelete) return;

    try {
      await axiosClient.delete(`/reviews/${reviewId}`);
      // Remove from state
      setReviews(reviews.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Failed to delete review:", err);
      alert("Gagal menghapus ulasan. Silakan coba lagi.");
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
      <section className="flex flex-col gap-6 pt-2">
        
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-gray-800 leading-7">Riwayat Review</h2>
          <p className="text-sm text-gray-500 leading-5">Daftar ulasan yang telah Anda berikan untuk layanan kami</p>
        </div>

        {/* Reviews List */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Memuat data ulasan...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center shadow-sm">
            <p className="text-gray-500 font-medium mb-3">Belum ada riwayat ulasan yang diberikan.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reviews.map((row, idx) => (
              <div 
                key={row.id} 
                className="bg-white rounded-[24px] border border-gray-100 p-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] flex flex-col justify-between gap-4"
              >
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-[#8B6B7A] tracking-wider uppercase">
                      Ulasan #{idx + 1}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">
                      {new Date(row.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric"
                      })}
                    </span>
                  </div>

                  <div className="flex flex-col gap-1">
                    <h3 className="text-lg font-bold text-gray-800 truncate">
                      {row.salon?.name || "Salon Kecantikan"}
                    </h3>
                    <div className="flex items-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon key={i} filled={i < row.rating} className="w-4 h-4" />
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-gray-650 italic mt-1 bg-[#FCF9F8] p-4 rounded-xl border border-gray-50">
                    "{row.comment || "Tidak ada komentar tertulis"}"
                  </p>
                </div>

                <div className="flex items-center gap-3 pt-2 border-t border-gray-50 justify-end">
                  <button
                    onClick={() => handleEditClick(row)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-gray-700 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                  >
                    Edit Ulasan
                  </button>
                  <button
                    onClick={() => handleDeleteReview(row.id)}
                    className="px-4 py-2 text-xs font-semibold rounded-xl text-red-650 bg-red-50 hover:bg-red-100/70 transition-colors cursor-pointer"
                    style={{ color: "#DC2626" }}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Edit Review Modal */}
      {editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-[24px] border border-gray-100 max-w-md w-full p-8 shadow-2xl relative flex flex-col gap-6 animate-in fade-in zoom-in duration-200">
            <div>
              <h3 className="text-xl font-bold text-gray-800">Edit Ulasan Anda</h3>
              <p className="text-gray-500 text-sm mt-1">Ubah penilaian Anda untuk {editingReview.salon?.name}</p>
            </div>

            {editError && (
              <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">
                {editError}
              </div>
            )}

            <form onSubmit={handleUpdateReview} className="flex flex-col gap-5">
              {/* Star rating selector */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rating</label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <StarIcon
                      key={star}
                      filled={star <= editRating}
                      onClick={() => setEditRating(star)}
                      className="w-8 h-8"
                      interactive={true}
                    />
                  ))}
                </div>
              </div>

              {/* Comment text area */}
              <div className="flex flex-col gap-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Komentar / Catatan</label>
                <textarea
                  value={editComment}
                  onChange={(e) => setEditComment(e.target.value)}
                  rows="4"
                  placeholder="Ceritakan pengalaman perawatan Anda..."
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors resize-none text-gray-800 font-medium"
                />
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingReview(null)}
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold text-sm hover:bg-gray-50 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 rounded-xl text-white font-bold text-sm tracking-wide transition-all shadow-md disabled:opacity-70"
                  style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
                >
                  {saving ? "Menyimpan..." : "Simpan Ulasan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
