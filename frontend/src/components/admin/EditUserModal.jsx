import React from 'react';

export default function EditUserModal({
  show,
  onClose,
  onSubmit,
  saving,
  editingUser,
  me,
  editName, setEditName,
  editEmail, setEditEmail,
  editPassword, setEditPassword,
  editRole, setEditRole,
  editIsActive, setEditIsActive
}) {
  if (!show || !editingUser) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Ubah Data Pengguna</h3>
            <p className="text-xs text-gray-500 mt-1">Ubah data profil atau status aktifasi user.</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg font-bold"
          >
            ✕
          </button>
        </div>

        <form onSubmit={onSubmit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Lengkap</label>
            <input
              type="text"
              required
              placeholder="Nama Lengkap"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Kata Sandi Baru (Opsional)</label>
            <input
              type="password"
              placeholder="Kosongkan jika tidak ingin diubah"
              value={editPassword}
              onChange={(e) => setEditPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Hak Akses (Role)</label>
            <select
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
              disabled={me?.id === editingUser.id}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors disabled:opacity-50"
            >
              <option value="user">Customer biasa</option>
              <option value="admin">Administrator</option>
              <option value="owner">Owner Salon (Pemilik)</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Status Akun</label>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  checked={editIsActive === true}
                  onChange={() => setEditIsActive(true)}
                  className="text-glowup-brand focus:ring-glowup-brand"
                  disabled={me?.id === editingUser.id}
                />
                Aktif
              </label>
              <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                <input
                  type="radio"
                  name="isActive"
                  checked={editIsActive === false}
                  onChange={() => setEditIsActive(false)}
                  className="text-glowup-brand focus:ring-glowup-brand"
                  disabled={me?.id === editingUser.id}
                />
                Nonaktif
              </label>
            </div>
          </div>

          <div className="flex gap-3 mt-4">
            <button
              type="button"
              onClick={onClose}
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
  );
}
