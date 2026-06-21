import React from 'react';

export default function AddUserModal({
  show,
  onClose,
  onSubmit,
  saving,
  name, setName,
  email, setEmail,
  password, setPassword,
  role, setRole
}) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-bold text-gray-800">Registrasi Pengguna Baru</h3>
            <p className="text-xs text-gray-500 mt-1">Daftarkan akun dengan peran khusus.</p>
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
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Email</label>
            <input
              type="email"
              required
              placeholder="email@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Kata Sandi</label>
            <input
              type="password"
              required
              placeholder="Minimal 6 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Hak Akses (Role)</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-glowup-brand transition-colors"
            >
              <option value="user">Customer biasa</option>
              <option value="owner">Owner Salon (Pemilik)</option>
            </select>
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
              {saving ? "Menyimpan..." : "Simpan Akun"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
