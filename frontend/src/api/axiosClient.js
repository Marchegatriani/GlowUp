import axios from 'axios';

// Inisialisasi axios dengan base URL backend FastAPI Anda
const axiosClient = axios.create({
  baseURL: 'http://localhost:8000', // Ganti jika port backend Anda berbeda
});

// Interceptor untuk otomatis menyisipkan Token JWT ke Header Authorization
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Interceptor untuk menangani error respons secara global (misal: Token expired / Akun dinonaktifkan)
axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Jika statusnya 401 (Unauthorized) atau 403 (Forbidden), hapus token dan arahkan ke login
      localStorage.removeItem('access_token');
      // Opsional: Redirect langsung jika Anda belum mengelolanya di level komponen
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
