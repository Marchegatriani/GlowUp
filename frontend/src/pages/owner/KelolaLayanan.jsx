import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

export default function KelolaLayanan() {
  const [salon, setSalon] = useState(null);
  const [myServices, setMyServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states for adding service
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("30");

  // Form states for editing service
  const [editingService, setEditingService] = useState(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editDuration, setEditDuration] = useState("30");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get owner profile & salon
      const userRes = await axiosClient.get("/me");
      const salonsRes = await axiosClient.get("/salons");
      const mySalon = salonsRes.data.find(s => s.owner_id === userRes.data.id);

      if (mySalon) {
        setSalon(mySalon);

        // 2. Fetch my salon's active services
        const mySvcRes = await axiosClient.get(`/salons/${mySalon.id}/services`);
        setMyServices(mySvcRes.data);
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

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nama layanan tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.post(`/salons/${salon.id}/services`, {
        name: name.trim(),
        description: description.trim() || null,
        price: parseInt(price),
        duration_minutes: parseInt(duration),
      });

      setSuccess("Layanan berhasil ditambahkan ke salon Anda!");
      setName("");
      setDescription("");
      setPrice("");
      setDuration("30");
      setShowAddModal(false);
      fetchData(); // Refetch
    } catch (err) {
      console.error("Gagal menambahkan layanan:", err);
      setError(err.response?.data?.detail || "Gagal menambahkan layanan ke salon.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (svc) => {
    setEditingService(svc);
    setEditName(svc.name);
    setEditDescription(svc.description || "");
    setEditPrice(svc.price);
    setEditDuration(svc.duration_minutes.toString());
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError("Nama layanan tidak boleh kosong.");
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.put(`/salons/${salon.id}/services/${editingService.id}`, {
        name: editName.trim(),
        description: editDescription.trim() || null,
        price: parseInt(editPrice),
        duration_minutes: parseInt(editDuration),
      });

      setSuccess("Layanan berhasil diperbarui!");
      setShowEditModal(false);
      setEditingService(null);
      fetchData(); // Refetch
    } catch (err) {
      console.error("Gagal memperbarui layanan:", err);
      setError(err.response?.data?.detail || "Gagal memperbarui layanan.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = async (serviceId, serviceName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus layanan "${serviceName}"?`)) {
      return;
    }
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.delete(`/salons/${salon.id}/services/${serviceId}`);
      setSuccess(`Layanan "${serviceName}" berhasil dihapus.`);
      fetchData();
    } catch (err) {
      console.error("Gagal menghapus layanan:", err);
      setError("Gagal menghapus layanan.");
    }
  };

  return (
    <div className="flex min-h-screen bg-glowup-bg font-inter">
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
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
                style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
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
                onClick={() => setShowAddModal(true)}
                className="text-sm font-bold text-glowup-brand hover:underline"
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
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama Treatment</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Deskripsi</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Durasi</th>
                      <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Harga</th>
                      <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {myServices.map((msvc, idx) => (
                      <tr key={msvc.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                        <td className="px-8 py-6 text-sm font-bold text-gray-400 whitespace-nowrap">
                          {idx + 1}
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-gray-800 whitespace-nowrap">
                          {msvc.name}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-500 max-w-[320px] truncate">
                          {msvc.description || "-"}
                        </td>
                        <td className="px-8 py-6 text-sm text-gray-650 font-semibold whitespace-nowrap">
                          {msvc.duration_minutes} Menit
                        </td>
                        <td className="px-8 py-6 text-sm font-bold text-glowup-brand whitespace-nowrap">
                          Rp {msvc.price.toLocaleString("id-ID")}
                        </td>
                        <td className="px-8 py-6 text-center whitespace-nowrap flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEditClick(msvc)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteClick(msvc.id, msvc.name)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-600 border border-red-200 hover:bg-red-100 transition-all"
                          >
                            Hapus
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Service Modal */}
          {showAddModal && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Tambah Layanan Salon</h3>
                    <p className="text-xs text-gray-500 mt-1">Buat treatment khusus untuk ditawarkan di salon Anda.</p>
                  </div>
                  <button
                    onClick={() => setShowAddModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Treatment</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Potong Rambut Premium"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Deskripsi Layanan</label>
                    <textarea
                      placeholder="Contoh: Termasuk cuci rambut, pijat kepala, dan vitamin"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Harga Salon (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 150000"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Durasi Treatment (Menit)</label>
                    <select
                      required
                      value={duration}
                      onChange={(e) => setDuration(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
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
                      onClick={() => setShowAddModal(false)}
                      className="flex-1 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm"
                      style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
                    >
                      {saving ? "Menyimpan..." : "Tambahkan"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Edit Service Modal */}
          {showEditModal && editingService && (
            <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">Edit Layanan Salon</h3>
                    <p className="text-xs text-gray-500 mt-1">Ubah detail treatment di salon Anda.</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowEditModal(false);
                      setEditingService(null);
                    }}
                    className="text-gray-400 hover:text-gray-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleEditSubmit} className="flex flex-col gap-5">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Treatment</label>
                    <input
                      type="text"
                      required
                      placeholder="Contoh: Potong Rambut Premium"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Deskripsi Layanan</label>
                    <textarea
                      placeholder="Contoh: Termasuk cuci rambut, pijat kepala, dan vitamin"
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      rows="3"
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors resize-none"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Harga Salon (Rp)</label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 150000"
                      value={editPrice}
                      onChange={(e) => setEditPrice(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Durasi Treatment (Menit)</label>
                    <select
                      required
                      value={editDuration}
                      onChange={(e) => setEditDuration(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
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
                      onClick={() => {
                        setShowEditModal(false);
                        setEditingService(null);
                      }}
                      className="flex-1 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm"
                      style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
                    >
                      {saving ? "Menyimpan..." : "Simpan Perubahan"}
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
