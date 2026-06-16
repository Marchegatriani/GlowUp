import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";

export default function KelolaUser() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("owner");

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/admin/users");
      setUsers(response.data);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      await axiosClient.post("/admin/users", {
        name,
        email,
        password,
        role,
      });
      setSuccess(`User dengan role ${role} berhasil dibuat!`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("owner");
      setShowModal(false);
      fetchUsers(); // Refresh list
    } catch (err) {
      console.error("Gagal membuat user:", err);
      setError(err.response?.data?.detail || "Gagal membuat user baru.");
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700";
      case "owner":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
            Kelola Pengguna
          </h1>
          <p className="text-[#5E5F5B] text-base font-normal leading-6">
            Daftar dan buat akun untuk Owner Salon, Admin, maupun Customer.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
          style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
        >
          Tambah Pengguna
        </button>
      </header>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">
          {success}
        </div>
      )}

      {/* Users Table */}
      <div className="glass-card rounded-[24px] overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">ID</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 font-medium">Memuat data pengguna...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 font-medium">Belum ada pengguna.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <tr key={user.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                    <td className="px-8 py-6 text-sm font-bold text-gray-700 whitespace-nowrap">
                      #{user.id}
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-gray-800 whitespace-nowrap">
                      {user.name}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-md w-full shadow-2xl p-8 flex flex-col gap-6">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Registrasi Pengguna Baru</h3>
                <p className="text-xs text-gray-500 mt-1">Daftarkan akun dengan peran khusus.</p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 bg-red-50 text-red-600 border border-red-100 rounded-xl text-xs font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  placeholder="Nama Lengkap"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
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
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-gray-700 text-xs font-bold uppercase tracking-wider">Hak Akses (Role)</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm outline-none focus:border-[#8B6B7A] transition-colors"
                >
                  <option value="owner">Owner Salon (Pemilik)</option>
                  <option value="admin">Administrator</option>
                  <option value="user">Customer biasa</option>
                </select>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3.5 rounded-xl bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm font-bold transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl text-white text-sm font-bold transition-all shadow-sm"
                  style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
                >
                  Simpan Akun
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
