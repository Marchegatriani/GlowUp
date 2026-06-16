import { Link } from "react-router-dom";

export default function Booking() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Halaman Booking</h1>
        <p className="text-slate-600 mb-8">
          Fitur booking sedang dalam tahap pengembangan.
        </p>
        
        <Link 
          to="/user/beranda" 
          className="inline-block w-full py-3 px-4 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-lg transition-colors duration-200"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
