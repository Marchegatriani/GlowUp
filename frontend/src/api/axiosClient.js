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

export default axiosClient;
