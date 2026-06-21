import React from "react";

export default function SalonProfileDisplay({
  salon,
  setIsEditing,
  uploadingGallery,
  handleGalleryUpload,
  galleries,
  handleGalleryDelete
}) {
  return (
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
  );
}
