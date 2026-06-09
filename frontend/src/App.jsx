import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <Router>
      <div className="app-container">
        {/* Nanti Anda bisa letakkan Navbar di sini agar muncul di semua halaman */}
        
        <Routes>
          {/* 1. Halaman Publik */}
          <Route path="/" element={<h2>Halaman Utama (Daftar Salon)</h2>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 2. Halaman Protected (Sementara pakai rute biasa dulu) */}
          <Route path="/user/dashboard" element={<h2>Dashboard Customer</h2>} />
          <Route path="/owner/dashboard" element={<h2>Dashboard Owner Salon</h2>} />
          <Route path="/admin/dashboard" element={<h2>Dashboard Admin</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;