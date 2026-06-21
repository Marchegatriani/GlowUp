import React from "react";

export default function SalonForm({
  handleSubmit,
  name, setName,
  phoneNumber, setPhoneNumber,
  openTime, setOpenTime,
  closeTime, setCloseTime,
  address, setAddress,
  allCategories,
  selectedCategoryIds,
  handleCategoryToggle,
  imageFile, setImageFile,
  imageUrl,
  description, setDescription,
  salon,
  setIsEditing,
  saving
}) {
  return (
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
  );
}
