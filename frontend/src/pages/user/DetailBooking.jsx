import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function DetailBooking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // States untuk Ulasan/Review
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [reviewSuccess, setReviewSuccess] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const response = await axiosClient.get(`/bookings/${id}`);
        setBooking(response.data);
      } catch (error) {
        console.error("Gagal memuat detail booking:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooking();
  }, [id]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setReviewError(null);
    setReviewSuccess(null);
    try {
      await axiosClient.post("/reviews", {
        booking_id: booking.id,
        rating: parseInt(rating),
        comment: comment || null
      });
      setReviewSuccess("Terima kasih! Ulasan Anda berhasil dikirim.");
      
      // Reload booking to get the updated review state
      const response = await axiosClient.get(`/bookings/${id}`);
      setBooking(response.data);
    } catch (err) {
      console.error("Gagal mengirim ulasan:", err);
      setReviewError(err.response?.data?.detail || "Gagal mengirim ulasan.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Memuat detail booking...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Booking tidak ditemukan.</p>
        <Link to="/user/beranda" className="text-glowup-brand hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "confirmed": return "bg-blue-100 text-blue-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Detail Booking</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="flex flex-col gap-6">


          <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-sm font-medium">Tanggal & Waktu</span>
            <span className="text-gray-800 font-bold">
              {new Date(booking.booking_time).toLocaleString("id-ID", {
                dateStyle: "full",
                timeStyle: "short"
              })}
            </span>
          </div>

          <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-sm font-medium">Total Harga</span>
            <span className="text-glowup-brand text-xl font-bold">
              Rp {booking.total_price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        {/* Review Section */}
        {booking.status.toLowerCase() === "completed" && (
          <div className="mt-8 border-t border-gray-150 pt-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Ulasan Layanan</h3>
            
            {booking.review ? (
              <div className="p-5 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-2">
                <div className="flex items-center gap-1.5">
                  <span className="text-sm font-semibold text-gray-800">Rating Anda:</span>
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill={i < booking.review.rating ? "#EAB308" : "none"}
                        stroke={i < booking.review.rating ? "#EAB308" : "#9CA3AF"}
                        strokeWidth="2"
                      >
                        <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                      </svg>
                    ))}
                  </div>
                </div>
                {booking.review.comment && (
                  <p className="text-sm text-gray-650 italic mt-1 bg-white p-3 rounded-lg border border-gray-50">
                    "{booking.review.comment}"
                  </p>
                )}
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="flex flex-col gap-4">
                {reviewSuccess && (
                  <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-medium border border-green-150">
                    {reviewSuccess}
                  </div>
                )}
                {reviewError && (
                  <div className="p-3 bg-red-50 text-red-600 rounded-lg text-xs font-medium border border-red-150">
                    {reviewError}
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Berikan Rating</label>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="focus:outline-none transition-transform active:scale-95"
                      >
                        <svg
                          width="28"
                          height="28"
                          viewBox="0 0 24 24"
                          fill={star <= rating ? "#EAB308" : "none"}
                          stroke={star <= rating ? "#EAB308" : "#9CA3AF"}
                          strokeWidth="2"
                        >
                          <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Komentar / Catatan</label>
                  <textarea
                    placeholder="Bagikan pengalaman perawatan Anda di salon ini..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors resize-none font-medium text-gray-800"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-3.5 rounded-xl text-white text-sm font-bold tracking-wide transition-all shadow-sm hover:shadow-md disabled:opacity-75"
                  style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
                >
                  {submitting ? "Mengirim..." : "Kirim Ulasan"}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="mt-10 flex flex-col gap-3">
          {booking.status.toLowerCase() === "pending" && (
            <Link
              to={`/user/pembayaran/${booking.id}`}
              className="w-full py-4 rounded-xl text-white text-center text-base font-bold tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
            >
              Lanjutkan Pembayaran
            </Link>
          )}
          <Link
            to="/user/beranda"
            className="w-full py-4 rounded-xl text-gray-700 bg-gray-50 text-center text-base font-bold transition-all hover:bg-gray-100"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
