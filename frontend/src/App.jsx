import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import LandingPage from './pages/LandingPage';
import Beranda from './pages/user/Beranda';
import Jelajah from './pages/user/Jelajah';
import Detail from './pages/user/Detail';
import Booking from './pages/user/Booking';
import Pembayaran from './pages/user/Pembayaran';
import DetailBooking from './pages/user/DetailBooking';
import UserLayout from './components/UserLayout';

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
            <Route path="/user/pembayaran/:id" element={<Pembayaran />} />
            <Route path="/user/detail-booking/:id" element={<DetailBooking />} />
          </Route>

          {/* Placeholder untuk rute lain nanti */}
          <Route path="/user/dashboard" element={<h2>Dashboard Customer (Placeholder)</h2>} />
          <Route path="/owner/dashboard" element={<h2>Dashboard Owner Salon (Placeholder)</h2>} />
          <Route path="/admin/dashboard" element={<h2>Dashboard Admin (Placeholder)</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;