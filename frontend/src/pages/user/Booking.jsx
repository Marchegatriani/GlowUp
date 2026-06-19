import { Link } from "react-router-dom";

export default function Booking() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-glowup-bg">
      <div className="text-center bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Halaman Booking</h1>
        <p className="text-slate-600 mb-8">
          Fitur booking sedang dalam tahap pengembangan.
        </p>
        
        <Link 
          to="/user/beranda" 
          className="inline-block w-full py-3 px-4 bg-glowup-brand hover:opacity-90 text-white font-semibold rounded-lg transition-colors duration-200 text-center"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  );
}
