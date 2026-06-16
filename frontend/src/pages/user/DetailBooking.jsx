import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function DetailBooking() {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

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
        <Link to="/user/beranda" className="text-[#8B6B7A] hover:underline">Kembali ke Beranda</Link>
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
          <h1 className="text-2xl font-bold text-gray-800">Detail Reservasi</h1>
          <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getStatusColor(booking.status)}`}>
            {booking.status}
          </span>
        </div>

        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-1 border-b border-gray-100 pb-4">
            <span className="text-gray-500 text-sm font-medium">ID Reservasi</span>
            <span className="text-gray-800 font-bold">#GLOW-{booking.id.toString().padStart(4, '0')}</span>
          </div>

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
            <span className="text-[#8B6B7A] text-xl font-bold">
              Rp {booking.total_price.toLocaleString("id-ID")}
            </span>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {booking.status.toLowerCase() === "pending" && (
            <Link
              to={`/user/pembayaran/${booking.id}`}
              className="w-full py-4 rounded-xl text-white text-center text-base font-bold tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5"
              style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
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
