import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import axiosClient from "../../api/axiosClient";
import SalonForm from "../../components/owner/SalonForm";
import SalonProfileDisplay from "../../components/owner/SalonProfileDisplay";

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
      const salonsRes = await axiosClient.get("/salons");
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
        const res = await axiosClient.post("/salons", formData, {
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
                <SalonForm
                  handleSubmit={handleSubmit}
                  name={name} setName={setName}
                  phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber}
                  openTime={openTime} setOpenTime={setOpenTime}
                  closeTime={closeTime} setCloseTime={setCloseTime}
                  address={address} setAddress={setAddress}
                  allCategories={allCategories}
                  selectedCategoryIds={selectedCategoryIds}
                  handleCategoryToggle={handleCategoryToggle}
                  imageFile={imageFile} setImageFile={setImageFile}
                  imageUrl={imageUrl}
                  description={description} setDescription={setDescription}
                  salon={salon}
                  setIsEditing={setIsEditing}
                  saving={saving}
                />
              ) : (
                <SalonProfileDisplay
                  salon={salon}
                  setIsEditing={setIsEditing}
                  uploadingGallery={uploadingGallery}
                  handleGalleryUpload={handleGalleryUpload}
                  galleries={galleries}
                  handleGalleryDelete={handleGalleryDelete}
                />
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
