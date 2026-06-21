import React from "react";

export default function DeleteSalonModal({
  show,
  salonToDelete,
  onClose,
  onConfirm
}) {
  if (!show || !salonToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800">Hapus Kemitraan Salon</h3>
        <p className="text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus salon <strong>{salonToDelete.name}</strong> milik <strong>{salonToDelete.owner_name}</strong> secara permanen dari platform? Tindakan ini tidak dapat dibatalkan.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-bold transition-all shadow-sm"
          >
            Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
