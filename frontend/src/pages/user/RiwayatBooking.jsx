import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../../api/axiosClient";


export default function RiwayatBooking() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const response = await axiosClient.get("/bookings/me");
      setBookings(response.data);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "confirmed":
        return "bg-green-100 text-green-600";
      case "completed":
        return "bg-blue-100 text-blue-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "Menunggu";
      case "confirmed":
        return "Dikonfirmasi";
      case "completed":
        return "Selesai";
      case "cancelled":
        return "Dibatalkan";
      default:
        return status;
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-6 sm:px-10 lg:px-16 py-8">
      <section className="flex flex-col gap-6 pt-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-800 leading-7">Riwayat Booking</h2>
            <p className="text-sm text-gray-500 leading-5">Daftar layanan yang telah Anda pesan</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-50">
                  <th className="text-left text-xs font-bold text-gray-400 px-8 py-5">No</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Layanan</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Salon</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Tanggal</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Harga</th>
                  <th className="text-left text-xs font-bold text-gray-400 px-6 py-5">Status</th>
                  <th className="text-right text-xs font-bold text-gray-400 px-6 py-5">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500 text-sm">Memuat data...</td>
                  </tr>
                ) : bookings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500 text-sm">Belum ada riwayat Booking</td>
                  </tr>
                ) : (
                  bookings.map((row, idx) => (
                    <tr key={row.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                      <td className="px-8 py-6 text-sm font-bold text-gray-700 whitespace-nowrap">
                        {idx + 1}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-850 font-semibold truncate max-w-[200px] whitespace-nowrap">
                        {row.services?.map(s => s.salon_service?.name).join(", ") || "Layanan Salon"}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">
                        {row.salon?.name || "Salon"}
                      </td>
                      <td className="px-6 py-6 text-sm text-gray-500 whitespace-nowrap">
                        {new Date(row.booking_time).toLocaleString("id-ID", { dateStyle: "medium" })}
                      </td>
                      <td className="px-6 py-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                        Rp {row.total_price?.toLocaleString("id-ID")}
                      </td>
                      <td className="px-6 py-6">
                        <span
                          className={`inline-flex px-3 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(row.status)}`}
                        >
                          {getStatusText(row.status)}
                        </span>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <Link to={`/user/detail-booking/${row.id}`} className="text-sm font-bold text-glowup-brand hover:underline">
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
