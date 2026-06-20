import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

export default function KelolaBooking() {
  const [salon, setSalon] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get owner profile & active salon
      const userRes = await axiosClient.get("/me");
      const salonsRes = await axiosClient.get("/salons/");
      const mySalon = salonsRes.data.find((s) => s.owner_id === userRes.data.id);

      if (mySalon) {
        setSalon(mySalon);

        // 2. Fetch bookings for this salon
        const bookingsRes = await axiosClient.get(`/bookings/salons/${mySalon.id}`);
        // Sort by booking time descending
        const sortedBookings = bookingsRes.data.sort(
          (a, b) => new Date(b.booking_time) - new Date(a.booking_time)
        );
        setBookings(sortedBookings);
      }
    } catch (err) {
      console.error("Gagal memuat data booking:", err);
      setError("Gagal memuat data Booking. Pastikan profil salon sudah didaftarkan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (bookingId, newStatus) => {
    try {
      setUpdatingId(bookingId);
      setError(null);
      setSuccess(null);

      await axiosClient.put(`/bookings/${bookingId}/status`, {
        status: newStatus,
      });

      setSuccess(`Status Booking berhasil diperbarui menjadi "${newStatus.toUpperCase()}"!`);
      
      // Refetch data
      const bookingsRes = await axiosClient.get(`/bookings/salons/${salon.id}`);
      const sortedBookings = bookingsRes.data.sort(
        (a, b) => new Date(b.booking_time) - new Date(a.booking_time)
      );
      setBookings(sortedBookings);
    } catch (err) {
      console.error("Gagal mengubah status booking:", err);
      setError(err.response?.data?.detail || "Gagal memperbarui status Booking.");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return { bg: "#FEF9C3", text: "#854D0E", label: "Menunggu Konfirmasi" };
      case "confirmed":
        return { bg: "#DBEAFE", text: "#1E40AF", label: "Dikonfirmasi" };
      case "completed":
        return { bg: "#DCFCE7", text: "#166534", label: "Selesai (Treatment Done)" };
      case "cancelled":
        return { bg: "#FEE2E2", text: "#991B1B", label: "Dibatalkan" };
      default:
        return { bg: "#F3F4F6", text: "#374151", label: status?.toUpperCase() };
    }
  };

  return (
    <div className="flex min-h-screen bg-glowup-bg font-inter">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen">
        <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
          
          {/* Header */}
          <header className="flex flex-col gap-2">
            <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
              Kelola Booking Pelanggan
            </h1>
            <p className="text-[#5E5F5B] text-base font-normal leading-6">
              Pantau jadwal, konfirmasi Booking, dan perbarui status kunjungan treatment pelanggan Anda.
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

          {loading ? (
            <div className="py-20 text-center text-gray-500 font-medium">
              Memuat data Booking...
            </div>
          ) : !salon ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 text-center flex flex-col items-center justify-center gap-4">
              <p className="text-gray-500 font-medium">Anda belum mendaftarkan profil salon.</p>
              <p className="text-sm text-gray-400 max-w-sm">
                Lengkapi profil fisik salon Anda terlebih dahulu agar pelanggan dapat melakukan Booking dan datanya muncul di sini.
              </p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 text-center">
              <p className="text-gray-500 font-medium">Belum ada data booking dari pelanggan untuk salon Anda.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[24px] overflow-hidden border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Pelanggan</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Layanan</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Tanggal & Waktu</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Total Harga</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                      <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Aksi Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map((booking, idx) => {
                      const badge = getStatusBadge(booking.status);
                      const servicesText = booking.services
                        ?.map((s) => s.salon_service?.name)
                        .join(", ") || "Layanan Salon";

                      return (
                        <tr key={booking.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                          <td className="px-8 py-6 text-sm font-bold text-gray-450">
                            {idx + 1}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col">
                              <span className="text-sm font-bold text-gray-800">
                                {booking.user?.name || "Pelanggan"}
                              </span>
                              <span className="text-xs text-gray-450">
                                {booking.user?.email || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm text-gray-700 font-medium">
                            {servicesText}
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex flex-col text-sm">
                              <span className="font-bold text-gray-800">
                                {new Date(booking.booking_time).toLocaleDateString("id-ID", {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </span>
                              <span className="text-xs text-gray-550">
                                {new Date(booking.booking_time).toLocaleTimeString("id-ID", {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })} WIB
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-sm font-bold text-glowup-brand">
                            Rp {booking.total_price.toLocaleString("id-ID")}
                          </td>
                          <td className="px-8 py-6">
                            <span
                              className="inline-flex px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-[0.5px]"
                              style={{ backgroundColor: badge.bg, color: badge.text }}
                            >
                              {badge.label}
                            </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center justify-center gap-2">
                              {booking.status === "pending" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "confirmed")}
                                    disabled={updatingId !== null}
                                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold transition-all disabled:opacity-50"
                                  >
                                    Konfirmasi
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    disabled={updatingId !== null}
                                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all disabled:opacity-50"
                                  >
                                    Batalkan
                                  </button>
                                </>
                              )}
                              {booking.status === "confirmed" && (
                                <>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                                    disabled={updatingId !== null || new Date(booking.booking_time) > new Date()}
                                    title={new Date(booking.booking_time) > new Date() ? "Booking belum bisa diselesaikan karena waktu appointment belum tiba" : ""}
                                    className="px-3 py-1.5 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    Selesai Treatment
                                  </button>
                                  <button
                                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                                    disabled={updatingId !== null}
                                    className="px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold transition-all disabled:opacity-50"
                                  >
                                    Batalkan
                                  </button>
                                </>
                              )}
                              {booking.status !== "pending" && booking.status !== "confirmed" && (
                                <span className="text-gray-400 text-xs">-</span>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
