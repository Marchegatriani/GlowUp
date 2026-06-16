import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

export default function KelolaLayanan() {
  const [salon, setSalon] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [masterServices, setMasterServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states for adding service
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get owner profile & salon
      const userRes = await axiosClient.get("/me");
      const salonsRes = await axiosClient.get("/salons/");
      const mySalon = salonsRes.data.find(s => s.owner_id === userRes.data.id);

      if (mySalon) {
        setSalon(mySalon);

        // 2. Fetch my salon's active services
        const mySvcRes = await axiosClient.get(`/salons/${mySalon.id}/services`);
        setMyServices(mySvcRes.data);

        // 3. Fetch global master services templates
        const masterRes = await axiosClient.get("/services/");
        setMasterServices(masterRes.data);
      }
    } catch (err) {
      console.error("Gagal memuat data layanan salon:", err);
      setError("Gagal memuat data layanan. Pastikan profil salon sudah dibuat.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedServiceId) {
      setError("Pilih jenis layanan terlebih dahulu.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.post(`/salons/${salon.id}/services`, {
        service_id: parseInt(selectedServiceId),
        price: parseInt(price),
        duration_minutes: parseInt(duration),
      });

      setSuccess("Layanan berhasil ditambahkan ke salon Anda!");
      setSelectedServiceId("");
      setPrice("");
      setDuration("30");
      setShowModal(false);
      fetchData(); // Refetch
    } catch (err) {
      console.error("Gagal menambahkan layanan:", err);
      setError(err.response?.data?.detail || "Gagal menambahkan layanan ke salon.");
    } finally {
      setSaving(false);
    }
  };

  // Filter out master services that the salon already has
  const availableMasterServices = masterServices.filter(
    (ms) => !myServices.some((msvc) => msvc.service_id === ms.id)
  );

  return (
    <div className="flex min-h-screen bg-[#FCF9F8] font-inter">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen">
        <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
          
          {/* Header */}
          <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
                Kelola Layanan Salon
              </h1>
              <p className="text-[#5E5F5B] text-base font-normal leading-6">
                Kelola daftar treatment, durasi, dan tarif harga layanan di salon Anda.
              </p>
            </div>
            {salon && (
              <button
                onClick={() => setShowModal(true)}
                className="px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
                style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
              >
                Tambah Layanan Baru
              </button>
            )}
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
              Memuat data layanan...
            </div>
          ) : !salon ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 text-center flex flex-col items-center justify-center gap-4">
              <p className="text-gray-500 font-medium">Anda belum mendaftarkan profil salon.</p>
              <p className="text-sm text-gray-400 max-w-sm">Daftarkan profil fisik salon Anda terlebih dahulu di menu "Kelola Profil Salon" agar dapat mengisi menu layanan.</p>
            </div>
          ) : myServices.length === 0 ? (
            <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_1px_2px_rgba(0,0,0,0.05)] p-12 text-center">
              <p className="text-gray-500 font-medium mb-2">Salon Anda belum memiliki layanan perawatan aktif.</p>
              <button
                onClick={() => setShowModal(true)}
                className="text-sm font-bold text-[#8B6B7A] hover:underline"
              >
                Tambahkan treatment pertama sekarang
              </button>
            </div>
          ) : (
            <div className="glass-card rounded-[24px] overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Treatment</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Durasi</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myServices.map((msvc, idx) => (
                      <tr key={msvc.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                        <td className="px-8 py-6 text-sm font-bold text-gray-850 whitespace-nowrap">
                          {msvc.service?.name}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500">
                          {msvc.service?.description || "-"}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-650 font-semibold whitespace-nowrap">
                          {msvc.duration_minutes} Menit
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-[#8B6B7A] whitespace-nowrap">
                          Rp {msvc.price.toLocaleString("id-ID")}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Service Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Tambah Layanan Salon</h3>
                    <p className="text-xs text-gray-500 mt-1">Pilih jenis layanan master untuk diaktifkan di salon Anda.</p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Pilih Layanan</label>
                    <select
                      required
                      value={selectedServiceId}
                      onChange={(e) => setSelectedServiceId(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                    >
                      <option value="">-- Pilih Jenis Layanan --</option>
                      {availableMasterServices.map((ms) => (
                        <option key={ms.id} value={ms.id}>
                          {ms.name}
                        </option>
                      ))}
                    </select>
                    {availableMasterServices.length === 0 && (
                      <p className="text-[10px] text-yellow-600">Semua template master layanan sudah Anda miliki.</p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Harga Salon (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 150000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Durasi Treatment (Menit)</label>
                    <select
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                    >
                      <option value="15">15 Menit</option>
                      <option value="30">30 Menit</option>
                      <option value="45">45 Menit</option>
                      <option value="60">60 Menit</option>
                      <option value="90">90 Menit</option>
                      <option value="120">120 Menit</option>
                    </select>
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
                      disabled={saving || availableMasterServices.length === 0}
                      className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm disabled:opacity-50"
                      style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
                    >
                      {saving ? "Menyimpan..." : "Aktifkan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}