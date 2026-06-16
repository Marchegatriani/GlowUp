import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

export default function KelolaSalon() {
  const [salon, setSalon] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("21:00");
  const [imageUrl, setImageUrl] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // 1. Get current user
      const userRes = await axiosClient.get("/me");
      setCurrentUser(userRes.data);

      // 2. Get all salons and find mine
      const salonsRes = await axiosClient.get("/salons/");
      const mySalon = salonsRes.data.find(s => s.owner_id === userRes.data.id);
      
      if (mySalon) {
        setSalon(mySalon);
        setName(mySalon.name || "");
        setAddress(mySalon.address || "");
        setPhoneNumber(mySalon.phone_number || "");
        setDescription(mySalon.description || "");
        setImageUrl(mySalon.image_url || "");
        
        // Strip seconds if present in times (e.g. "09:00:00" -> "09:00")
        const formatTime = (timeStr) => timeStr ? timeStr.substring(0, 5) : "";
        setOpenTime(formatTime(mySalon.open_time) || "09:00");
        setCloseTime(formatTime(mySalon.close_time) || "21:00");
      }
    } catch (err) {
      console.error("Gagal memuat data profil salon:", err);
      setError("Gagal memuat data profil salon.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    const payload = {
      name,
      address,
      phone_number: phoneNumber,
      description: description || null,
      open_time: openTime,
      close_time: closeTime,
      image_url: imageUrl || null,
    };

    try {
      if (salon) {
        // Edit mode
        const res = await axiosClient.put(`/salons/${salon.id}`, payload);
        setSalon(res.data);
        setSuccess("Profil salon berhasil diperbarui!");
      } else {
        // Create mode
        const res = await axiosClient.post("/salons/", payload);
        setSalon(res.data);
        setSuccess("Salon berhasil didaftarkan!");
      }
    } catch (err) {
      console.error("Gagal menyimpan data salon:", err);
      setError(err.response?.data?.detail || "Gagal menyimpan data salon.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FCF9F8] font-inter">
      <Sidebar />
      <main className="flex-1 ml-[280px] min-h-screen">
        <div className="max-w-[800px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
          
          <header className="flex flex-col gap-2">
            <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
              Profil Salon Anda
            </h1>
            <p className="text-[#5E5F5B] text-base font-normal leading-6">
              {salon 
                ? "Perbarui detail operasional dan deskripsi salon Anda." 
                : "Daftarkan salon pertama Anda untuk mulai menerima booking."
              }
            </p>
          </header>

          {loading ? (
            <div className="py-20 text-center text-gray-500 font-medium">
              Memuat data profil...
            </div>
          ) : (
            <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-8">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium mb-6">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium mb-6">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Salon</label>
                  <input
                    type="text"
                    required
                    placeholder="Nama Salon"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">No. Telepon / Kontak</label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: 08123456789"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Jam Buka</label>
                    <input
                      type="time"
                      required
                      value={openTime}
                      onChange={(e) => setOpenTime(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800"
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Jam Tutup</label>
                    <input
                      type="time"
                      required
                      value={closeTime}
                      onChange={(e) => setCloseTime(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Alamat Lengkap</label>
                  <textarea
                    required
                    placeholder="Tulis alamat fisik salon Anda..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800 resize-none"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Link Gambar Salon (URL)</label>
                  <input
                    type="url"
                    placeholder="Contoh: https://images.unsplash.com/... atau link gambar lainnya"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Deskripsi Singkat</label>
                  <textarea
                    placeholder="Jelaskan mengenai keistimewaan salon Anda..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows="4"
                    className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-[#8B6B7A] transition-colors font-medium text-gray-800 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full py-4 rounded-xl text-white text-base font-bold tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 mt-4 disabled:opacity-75 disabled:cursor-not-allowed"
                  style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
                >
                  {saving ? "Menyimpan..." : (salon ? "Perbarui Profil Salon" : "Daftarkan Salon")}
                </button>
              </form>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
