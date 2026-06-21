import { useEffect, useState } from "react";
import axiosClient from "../../api/axiosClient";
import AddUserModal from "../../components/admin/AddUserModal";
import EditUserModal from "../../components/admin/EditUserModal";
import DeleteUserModal from "../../components/admin/DeleteUserModal";

export default function KelolaUser() {
  const [users, setUsers] = useState([]);
  const [me, setMe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Search & Filter state
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  // Form states - Create User
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");

  // Form states - Edit User
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editRole, setEditRole] = useState("user");
  const [editIsActive, setEditIsActive] = useState(true);

  // Delete User state
  const [userToDelete, setUserToDelete] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch me info (to prevent editing/deleting own admin account)
      const meRes = await axiosClient.get("/me");
      setMe(meRes.data);

      // Fetch user list
      const usersRes = await axiosClient.get("/admin/users");
      setUsers(usersRes.data);
    } catch (err) {
      console.error("Gagal memuat data pengguna:", err);
      setError("Gagal memuat data pengguna dari server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      await axiosClient.post("/admin/users", {
        name: name.trim(),
        email: email.trim(),
        password,
        role,
      });
      setSuccess(`Akun "${name}" dengan role ${role} berhasil dibuat!`);
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
      setShowAddModal(false);
      fetchData(); // Reload list
    } catch (err) {
      console.error("Gagal membuat user:", err);
      setError(err.response?.data?.detail || "Gagal membuat user baru.");
    } finally {
      setSaving(false);
    }
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
    setEditRole(user.role);
    setEditIsActive(user.is_active);
    setEditPassword(""); // Blank initially
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      const payload = {
        name: editName.trim(),
        email: editEmail.trim(),
        role: editRole,
        is_active: editIsActive,
      };
      if (editPassword) {
        payload.password = editPassword;
      }

      await axiosClient.put(`/admin/users/${editingUser.id}`, payload);
      setSuccess(`Detail pengguna "${editName}" berhasil diperbarui.`);
      setShowEditModal(false);
      setEditingUser(null);
      fetchData(); // Reload list
    } catch (err) {
      console.error("Gagal memperbarui user:", err);
      setError(err.response?.data?.detail || "Gagal memperbarui data user.");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (!userToDelete) return;
    setError(null);
    setSuccess(null);
    try {
      await axiosClient.delete(`/admin/users/${userToDelete.id}`);
      setSuccess(`Akun "${userToDelete.name}" berhasil dihapus.`);
      setUsers((prev) => prev.filter((u) => u.id !== userToDelete.id));
      setShowDeleteModal(false);
      setUserToDelete(null);
    } catch (err) {
      console.error("Gagal menghapus user:", err);
      setError(err.response?.data?.detail || "Gagal menghapus user dari sistem.");
      setShowDeleteModal(false);
    }
  };

  const getRoleBadge = (role) => {
    switch (role?.toLowerCase()) {
      case "admin":
        return "bg-purple-100 text-purple-700 border border-purple-200";
      case "owner":
        return "bg-blue-100 text-blue-700 border border-blue-200";
      default:
        return "bg-gray-100 text-gray-700 border border-gray-200";
    }
  };

  // Filter & Search Logic
  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "all" ||
      (roleFilter === "customer" && u.role === "user") ||
      (roleFilter === "owner" && u.role === "owner") ||
      (roleFilter === "admin" && u.role === "admin");

    return matchesSearch && matchesRole;
  });

  return (
    <div className="max-w-[1160px] mx-auto px-8 lg:px-16 py-10 flex flex-col gap-10">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#1B1C1C] font-bold text-[32px] leading-[48px] tracking-[-0.8px]">
            Kelola Pengguna
          </h1>
          <p className="text-[#5E5F5B] text-base font-normal leading-6">
            Daftar, edit, hapus, dan verifikasi akun Owner dan Customer.
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-6 py-3 rounded-xl text-white font-bold text-sm tracking-wide shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5 shrink-0"
          style={{ background: "linear-gradient(99deg, #F8C8DC 0%, #EFE4A2 100%)", color: "#2E1221" }}
        >
          Tambah Pengguna
        </button>
      </header>

      {success && (
        <div className="p-4 bg-green-50 text-green-700 rounded-xl border border-green-100 text-sm font-medium">
          {success}
        </div>
      )}

      {error && (
        <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 text-sm font-medium">
          {error}
        </div>
      )}

      {/* Toolbar Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] w-full">
        {/* Search */}
        <div className="relative w-full sm:max-w-xs">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-glowup-brand transition-colors bg-gray-50"
          />
          <svg
            className="absolute left-3.5 top-3.5 text-gray-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>

        {/* Filter Role */}
        <div className="flex items-center gap-2 w-full sm:w-auto self-stretch sm:self-auto">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Filter Peran</span>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:border-glowup-brand transition-colors bg-gray-50"
          >
            <option value="all">Semua Peran</option>
            <option value="customer">Customer / User</option>
            <option value="owner">Salon Owner</option>
            <option value="admin">Administrator</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="glass-card rounded-[24px] overflow-hidden bg-white border border-gray-100 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider w-16">#</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Nama</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Email</th>
                <th className="px-8 py-5 text-left text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-8 py-5 text-center text-xs font-bold text-gray-400 uppercase tracking-wider w-40">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">Memuat data pengguna...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-12 text-gray-500 font-medium">Belum ada pengguna yang terdaftar.</td>
                </tr>
              ) : (
                filteredUsers.map((user, idx) => (
                  <tr key={user.id} className={idx > 0 ? "border-t border-gray-50" : ""}>
                    <td className="px-8 py-6 text-sm font-bold text-gray-450 whitespace-nowrap">
                      {idx + 1}
                    </td>
                    <td className="px-8 py-6 text-sm font-semibold text-gray-805 whitespace-nowrap">
                      {user.name} {me?.id === user.id && <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded ml-1 font-bold">Saya</span>}
                    </td>
                    <td className="px-8 py-6 text-sm text-gray-500 whitespace-nowrap">
                      {user.email}
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getRoleBadge(user.role)}`}>
                        {user.role === "user" ? "Customer" : user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-center whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${user.is_active ? "bg-green-50 text-green-700 border border-green-100" : "bg-red-50 text-red-650 border border-red-100"
                        }`}>
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>
                    <td className="px-8 py-6 whitespace-nowrap text-center flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100 transition-all shadow-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(user)}
                        disabled={me?.id === user.id}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border shadow-sm ${me?.id === user.id
                            ? "bg-gray-50 text-gray-400 border-gray-200 cursor-not-allowed"
                            : "bg-red-50 text-red-600 border-red-200 hover:bg-red-100"
                          }`}
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Creation Modal */}
      <AddUserModal
        show={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleAddSubmit}
        saving={saving}
        name={name} setName={setName}
        email={email} setEmail={setEmail}
        password={password} setPassword={setPassword}
        role={role} setRole={setRole}
      />

      {/* Editing Modal */}
      <EditUserModal
        show={showEditModal}
        onClose={() => { setShowEditModal(false); setEditingUser(null); }}
        onSubmit={handleEditSubmit}
        saving={saving}
        editingUser={editingUser}
        me={me}
        editName={editName} setEditName={setEditName}
        editEmail={editEmail} setEditEmail={setEditEmail}
        editPassword={editPassword} setEditPassword={setEditPassword}
        editRole={editRole} setEditRole={setEditRole}
        editIsActive={editIsActive} setEditIsActive={setEditIsActive}
      />

      {/* Delete Confirmation Modal */}
      <DeleteUserModal
        show={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleConfirmDelete}
        userToDelete={userToDelete}
      />
    </div>
  );
}
