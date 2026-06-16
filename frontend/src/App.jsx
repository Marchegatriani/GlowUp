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

import OwnerDashboard from './pages/owner/Dashboard';
import KelolaLayananOwner from './pages/owner/KelolaLayanan';
import KelolaSalonOwner from './pages/owner/KelolaSalon';
import KelolaBooking from './pages/owner/KelolaBooking';

import AdminLayout from './components/AdminLayout';
import KelolaUser from './pages/admin/KelolaUser';
import KelolaMasterLayanan from './pages/admin/KelolaMasterLayanan';

// Komponen PrivateRoute untuk mengecek apakah user sudah login
const PrivateRoute = ({ children }) => {
  const isAuthenticated = !!localStorage.getItem("access_token");
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          {/* 1. Halaman Publik */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. Halaman Protected untuk Customer */}
          <Route element={<PrivateRoute><UserLayout /></PrivateRoute>}>
            <Route path="/user/beranda" element={<Beranda />} />
            <Route path="/user/jelajah" element={<Jelajah />} />
            <Route path="/user/salon/:id" element={<Detail />} />
            <Route path="/user/booking/:id" element={<Booking />} />
            <Route path="/user/riwayat-booking" element={<RiwayatBooking />} />
            <Route path="/user/riwayat-review" element={<RiwayatReview />} />
            <Route path="/user/pembayaran/:id" element={<Pembayaran />} />
            <Route path="/user/detail-booking/:id" element={<DetailBooking />} />
          </Route>

          {/* 3. Halaman Protected untuk Admin */}
          <Route element={<PrivateRoute><AdminLayout /></PrivateRoute>}>
            <Route path="/admin/dashboard" element={<KelolaUser />} />
            <Route path="/admin/users" element={<KelolaUser />} />
            <Route path="/admin/master-services" element={<KelolaMasterLayanan />} />
          </Route>

          {/* 4. Halaman Protected untuk Owner */}
          <Route path="/owner/dashboard" element={<PrivateRoute><OwnerDashboard /></PrivateRoute>} />
          <Route path="/owner/bookings" element={<PrivateRoute><KelolaBooking /></PrivateRoute>} />
          <Route path="/owner/services" element={<PrivateRoute><KelolaLayananOwner /></PrivateRoute>} />
          <Route path="/owner/salon-profile" element={<PrivateRoute><KelolaSalonOwner /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;