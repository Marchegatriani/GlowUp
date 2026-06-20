import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Beranda from './pages/user/Beranda';
import Jelajah from './pages/user/Jelajah';
import Detail from './pages/user/Detail';
import Booking from './pages/user/Booking';
import RiwayatBooking from './pages/user/RiwayatBooking';
import RiwayatReview from './pages/user/RiwayatReview';
import Pembayaran from './pages/user/Pembayaran';
import DetailBooking from './pages/user/DetailBooking';
import UserLayout from './components/UserLayout';

import { AuthProvider, useAuth } from './context/AuthContext';

import OwnerDashboard from './pages/owner/Dashboard';
import KelolaLayananOwner from './pages/owner/KelolaLayanan';
import KelolaSalonOwner from './pages/owner/KelolaSalon';
import KelolaBooking from './pages/owner/KelolaBooking';

import AdminLayout from './components/AdminLayout';
import KelolaUser from './pages/admin/KelolaUser';
import DashboardAdmin from './pages/admin/DashboardAdmin';
import KelolaSalonAdmin from './pages/admin/KelolaSalonAdmin';
import DetailSalonAdmin from './pages/admin/DetailSalonAdmin';

import PublicLayout from './components/PublicLayout';

// Komponen PrivateRoute untuk mengecek apakah user sudah login
const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

// Komponen Wrapper untuk halaman yang bisa diakses Public & User dengan Layout berbeda
const PublicOrUserLayout = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <UserLayout /> : <PublicLayout />;
};

function App() {
  return (
    <AuthProvider>
      <Router>
      <div className="app-container">
        <Routes>
          {/* 1. Halaman Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Halaman Browsing (Guest atau User) */}
          <Route element={<PublicOrUserLayout />}>
            <Route path="/user/jelajah" element={<Jelajah />} />
            <Route path="/user/salon/:id" element={<Detail />} />
          </Route>

          {/* 2. Halaman Customer */}
          <Route element={<UserLayout />}>
            {/* Halaman Terproteksi (Wajib Login) */}
            <Route path="/user/beranda" element={<PrivateRoute><Beranda /></PrivateRoute>} />
            <Route path="/user/booking/:id" element={<PrivateRoute><Booking /></PrivateRoute>} />
            <Route path="/user/riwayat-booking" element={<PrivateRoute><RiwayatBooking /></PrivateRoute>} />
            <Route path="/user/riwayat-review" element={<PrivateRoute><RiwayatReview /></PrivateRoute>} />
            <Route path="/user/pembayaran/:id" element={<PrivateRoute><Pembayaran /></PrivateRoute>} />
            <Route path="/user/detail-booking/:id" element={<PrivateRoute><DetailBooking /></PrivateRoute>} />
          </Route>

          {/* 3. Halaman Protected untuk Admin */}
          <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="/admin/dashboard" element={<DashboardAdmin />} />
            <Route path="/admin/users" element={<KelolaUser />} />
            <Route path="/admin/salons" element={<KelolaSalonAdmin />} />
            <Route path="/admin/salons/:id" element={<DetailSalonAdmin />} />
          </Route>

          {/* 4. Halaman Protected untuk Owner */}
          <Route path="/owner/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          <Route path="/owner/bookings" element={<PrivateRoute><KelolaBooking /></PrivateRoute>} />
          <Route path="/owner/services" element={<PrivateRoute><KelolaLayananOwner /></PrivateRoute>} />
          <Route path="/owner/salon-profile" element={<PrivateRoute><KelolaSalonOwner /></PrivateRoute>} />
        </Routes>
      </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
