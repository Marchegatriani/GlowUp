import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";

export default function KelolaSalon() {
  const [salon, setSalon] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [galleries, setGalleries] = useState([]);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [allCategories, setAllCategories] = useState([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState([]);

  // Form states
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [description, setDescription] = useState("");
  const [openTime, setOpenTime] = useState("09:00");
  const [closeTime, setCloseTime] = useState("21:00");
  const [imageUrl, setImageUrl] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get current user
      const userRes = await axiosClient.get("/me");
      setCurrentUser(userRes.data);

      // 2. Get all categories
      const catRes = await axiosClient.get("/salons/categories");
      setAllCategories(catRes.data);

      // 3. Get all salons and find mine
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
        setGalleries(mySalon.galleries || []);
        if (mySalon.categories) {
          setSelectedCategoryIds(mySalon.categories.map(c => c.id));
        }
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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("address", address);
    formData.append("phone_number", phoneNumber);
    if (description) formData.append("description", description);
    formData.append("open_time", openTime);
    formData.append("close_time", closeTime);
    formData.append("category_ids", selectedCategoryIds.join(","));
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      if (salon) {
        // Edit mode
        const res = await axiosClient.put(`/salons/${salon.id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSalon(res.data);
        setImageUrl(res.data.image_url);
        setSuccess("Profil salon berhasil diperbarui!");
        setIsEditing(false);
      } else {
        // Create mode
        const res = await axiosClient.post("/salons/", formData, {
          headers: { "Content-Type": "multipart/form-data" }
        });
        setSalon(res.data);
        setImageUrl(res.data.image_url);
        setSuccess("Salon berhasil didaftarkan!");
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Gagal menyimpan data salon:", err);
      setError(err.response?.data?.detail || "Gagal menyimpan data salon.");
    } finally {
      setSaving(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploadingGallery(true);
      setError(null);
      setSuccess(null);

      const formData = new FormData();
      formData.append("image", file);

      const res = await axiosClient.post(`/salons/${salon.id}/gallery`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      setGalleries([...galleries, res.data]);
      setSuccess("Foto galeri berhasil ditambahkan!");
    } catch (err) {
      console.error("Gagal upload foto galeri:", err);
      setError(err.response?.data?.detail || "Gagal mengunggah foto.");
    } finally {
      setUploadingGallery(false);
    }
  };

  const handleGalleryDelete = async (photoId) => {
    if (!window.confirm("Hapus foto ini dari galeri?")) return;

    try {
      setError(null);
      setSuccess(null);
      await axiosClient.delete(`/salons/gallery/${photoId}`);
      setGalleries(galleries.filter(g => g.id !== photoId));
      setSuccess("Foto berhasil dihapus.");
    } catch (err) {
      console.error("Gagal hapus foto galeri:", err);
      setError(err.response?.data?.detail || "Gagal menghapus foto.");
    }
  };

  const handleCategoryToggle = (id) => {
    if (selectedCategoryIds.includes(id)) {
      setSelectedCategoryIds(selectedCategoryIds.filter(cid => cid !== id));
    } else {
      setSelectedCategoryIds([...selectedCategoryIds, id]);
    }
  };

  return (
    <div className="flex min-h-screen bg-glowup-bg font-inter">
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
            <div className="flex flex-col gap-6">
              {error && (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">
                  {success}
                </div>
              )}

              {(!salon || isEditing) ? (
                <div className="bg-white rounded-[24px] border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] p-8">
                  <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Salon</label>
                      <input
                        type="text"
                        required
                        placeholder="Nama Salon"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800"
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
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800"
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
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800"
                        />
                      </div>
                      <div className="flex flex-col gap-2">
                        <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Jam Tutup</label>
                        <input
                          type="time"
                          required
                          value={closeTime}
                          onChange={(e) => setCloseTime(e.target.value)}
                          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800"
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
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800 resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Kategori Salon</label>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {allCategories.map(cat => (
                          <label key={cat.id} className={`cursor-pointer flex items-center px-4 py-2 rounded-full border text-sm font-medium transition-all ${
                            selectedCategoryIds.includes(cat.id) 
                            ? "bg-glowup-pink-50 border-glowup-brand text-glowup-brand shadow-sm" 
                            : "bg-white border-gray-200 text-gray-600 hover:border-gray-300"
                          }`}>
                            <input 
                              type="checkbox" 
                              className="hidden" 
                              checked={selectedCategoryIds.includes(cat.id)}
                              onChange={() => handleCategoryToggle(cat.id)}
                            />
                            {cat.name}
                          </label>
                        ))}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Pilih satu atau lebih kategori untuk salon Anda.</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Foto Salon</label>

                      {/* Image Preview */}
                      {(imageFile || imageUrl) && (
                        <div className="mb-2 w-full max-w-sm rounded-xl overflow-hidden border border-gray-200">
                          <img
                            src={imageFile ? URL.createObjectURL(imageFile) : imageUrl}
                            alt="Preview Salon"
                            className="w-full h-48 object-cover"
                          />
                        </div>
                      )}

                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          if (e.target.files && e.target.files.length > 0) {
                            setImageFile(e.target.files[0]);
                          }
                        }}
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-glowup-pink-50 file:text-glowup-brand hover:file:bg-glowup-pink-100"
                      />
                      <p className="text-xs text-gray-500 mt-1">Pilih foto dari perangkat Anda (Maks. disarankan 2MB).</p>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Deskripsi Singkat</label>
                      <textarea
                        placeholder="Jelaskan mengenai keistimewaan salon Anda..."
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows="4"
                        className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-gray-50 text-base outline-none focus:border-glowup-brand transition-colors font-medium text-gray-800 resize-none"
                      />
                    </div>

                    <div className="flex gap-4 mt-4">
                      {salon && (
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="flex-1 py-4 rounded-xl text-gray-700 bg-gray-100 hover:bg-gray-200 text-base font-bold transition-all"
                        >
                          Batal
                        </button>
                      )}
                      <button
                        type="submit"
                        disabled={saving}
                        className="flex-1 py-4 rounded-xl text-white text-base font-bold tracking-wide transition-all shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-75 disabled:cursor-not-allowed"
                        style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
                      >
                        {saving ? "Menyimpan..." : (salon ? "Simpan Perubahan" : "Daftarkan Salon")}
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-3xl border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)] overflow-hidden">
                  <div className="h-64 sm:h-96 relative bg-gray-100">
                    <img
                      src={salon.image_url || `https://api.builder.io/api/v1/image/assets/TEMP/${salon.id % 2 === 0 ? "4295490d2b008bb111491f419e44fca5db04c803" : "f522a522b78a02f7f219e665307f41b3cc812db9"}?width=1000`}
                      alt={salon.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-6 right-6">
                      <span className={`inline-flex px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md ${salon.is_active ? "bg-green-500 text-white" : "bg-red-500 text-white"
                        }`}>
                        {salon.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </div>
                  </div>

                  <div className="p-8 flex flex-col gap-4">
                    <div className="flex justify-between items-start">
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
                      <button
                        onClick={() => setIsEditing(true)}
                        className="px-6 py-2.5 rounded-xl text-white font-bold text-sm shadow-md transition-all hover:opacity-90"
                        style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
                      >
                        Edit Profil Salon
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Jam Operasional</span>
                        <span className="text-sm font-semibold text-gray-800">{salon.open_time} - {salon.close_time}</span>
                      </div>
                      <div className="flex flex-col gap-1">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Telepon / Kontak</span>
                        <span className="text-sm font-semibold text-gray-800">{salon.phone_number}</span>
                      </div>
                      <div className="flex flex-col gap-1 col-span-2 mt-2">
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Kategori</span>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {salon.categories && salon.categories.length > 0 ? (
                            salon.categories.map(c => (
                              <span key={c.id} className="px-3 py-1 bg-glowup-pink-50 text-glowup-brand rounded-full text-xs font-semibold">
                                {c.name}
                              </span>
                            ))
                          ) : (
                            <span className="text-sm text-gray-500">-</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-t border-gray-50 pt-5 mt-3">
                      <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider mb-2">Deskripsi Salon</h3>
                      <p className="text-gray-650 text-base leading-7 whitespace-pre-line">
                        {salon.description || "Tidak ada deskripsi yang disediakan."}
                      </p>
                    </div>

                    <div className="border-t border-gray-50 pt-5 mt-3">
                      <div className="flex justify-between items-center mb-4">
                        <h3 className="text-gray-800 text-sm font-bold uppercase tracking-wider">Galeri Hasil Kerja</h3>
                        <label className="cursor-pointer px-4 py-2 rounded-xl text-white font-bold text-xs transition-all shadow-md hover:shadow-lg" style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}>
                          {uploadingGallery ? "Mengunggah..." : "+ Tambah Foto"}
                          <input type="file" accept="image/*" className="hidden" onChange={handleGalleryUpload} disabled={uploadingGallery} />
                        </label>
                      </div>
                      
                      {galleries.length === 0 ? (
                        <p className="text-gray-500 text-sm text-center py-6 bg-gray-50 rounded-xl border border-gray-100">Belum ada foto galeri.</p>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                          {galleries.map(photo => (
                            <div key={photo.id} className="relative group rounded-xl overflow-hidden aspect-square border border-gray-200">
                              <img src={photo.image_url} alt="Gallery" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button onClick={() => handleGalleryDelete(photo.id)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 shadow-lg">
                                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
