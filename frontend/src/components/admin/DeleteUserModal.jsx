import React from 'react';

export default function DeleteUserModal({
  show,
  onClose,
  onConfirm,
  userToDelete
}) {
  if (!show || !userToDelete) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
        <h3 className="text-xl font-bold text-gray-800">Hapus Pengguna</h3>
        <p className="text-sm text-gray-500">
          Apakah Anda yakin ingin menghapus akun <strong>{userToDelete.name}</strong> ({userToDelete.email})?
        </p>
        <p className="text-xs text-red-500 border border-red-100 bg-red-50/50 p-3 rounded-lg leading-5">
          <strong>PENTING:</strong> Menghapus akun ini juga akan secara otomatis menghapus data Booking, review, pembayaran, dan salon (jika owner) yang terkait dengan pengguna ini.
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
            className="flex-1 py-3 rounded-xl text-[#2E1221] text-sm font-bold transition-all shadow-sm hover:brightness-[1.03]"
            style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)" }}
          >
            Hapus Permanen
          </button>
        </div>
      </div>
    </div>
  );
}
