import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import axiosClient from "../../api/axiosClient";

export default function Pembayaran() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayment = async () => {
      try {
        const response = await axiosClient.get(`/payments/${id}`);
        setPayment(response.data);
      } catch (err) {
        console.error("Gagal memuat data pembayaran:", err);
        setError("Gagal memuat data pembayaran.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayment();
  }, [id]);

  const handlePay = async () => {
    if (!selectedMethod) {
      setError("Pilih metode pembayaran terlebih dahulu.");
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);
      // Update payment method
      await axiosClient.post("/payments/", {
        booking_id: parseInt(id),
        method: selectedMethod
      });

      // Simulasi pembayaran berhasil (update status ke paid)
      await axiosClient.put(`/payments/${payment.id}/status`, {
        status: "paid"
      });

      // Redirect ke detail booking (atau history)
      navigate(`/user/detail-booking/${id}`);
    } catch (err) {
      console.error("Gagal memproses pembayaran:", err);
      setError("Gagal memproses pembayaran.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-gray-500 font-medium">Memuat data pembayaran...</p>
      </div>
    );
  }

  if (!payment) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500 font-medium">Data pembayaran tidak ditemukan.</p>
        <Link to="/user/beranda" className="text-[#8B6B7A] hover:underline">Kembali ke Beranda</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-['Inter',sans-serif] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-[24px] shadow-sm border border-gray-100 p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Pembayaran</h1>
          <p className="text-gray-500 text-sm mt-2">Pilih metode pembayaran untuk menyelesaikan reservasi Anda.</p>
        </div>

        {error && (
          <div className="p-3 mb-6 bg-red-50 text-red-600 rounded-lg text-sm font-medium border border-red-100 text-center">
            {error}
          </div>
        )}

        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-center border border-gray-100">
          <p className="text-gray-500 text-sm font-medium mb-1">Total Pembayaran</p>
          <p className="text-3xl font-bold text-[#8B6B7A]">Rp {payment.amount.toLocaleString("id-ID")}</p>
        </div>

        <div className="flex flex-col gap-4 mb-8">
          <label className="text-sm font-bold text-gray-700">PILIH METODE PEMBAYARAN</label>
          
          <button
            onClick={() => setSelectedMethod("ewallet")}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "ewallet" ? "border-[#8B6B7A] bg-pink-50/30" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg">E</div>
            <div className="text-left">
              <p className="font-bold text-gray-800">E-Wallet</p>
              <p className="text-xs text-gray-500">GoPay, OVO, Dana</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod("transfer")}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "transfer" ? "border-[#8B6B7A] bg-pink-50/30" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center text-green-600 font-bold text-lg">B</div>
            <div className="text-left">
              <p className="font-bold text-gray-800">Transfer Bank</p>
              <p className="text-xs text-gray-500">BCA, Mandiri, BNI</p>
            </div>
          </button>

          <button
            onClick={() => setSelectedMethod("cash")}
            className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${selectedMethod === "cash" ? "border-[#8B6B7A] bg-pink-50/30" : "border-gray-200 hover:border-gray-300"}`}
          >
            <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600 font-bold text-lg">C</div>
            <div className="text-left">
              <p className="font-bold text-gray-800">Bayar di Tempat</p>
              <p className="text-xs text-gray-500">Cash / Kartu Debit</p>
            </div>
          </button>
        </div>

        <button
          onClick={handlePay}
          disabled={isProcessing}
          className={`w-full py-4 rounded-xl text-white text-base font-bold tracking-wide transition-all shadow-md ${isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
          style={{ background: "linear-gradient(102deg, #8B6B7A 0%, #A98495 100%)" }}
        >
          {isProcessing ? "Memproses..." : "Bayar Sekarang"}
        </button>
        
        <div className="mt-4 text-center">
            <Link to="/user/beranda" className="text-sm text-gray-500 hover:text-gray-700">
                Batalkan & Kembali
            </Link>
        </div>
      </div>
    </div>
  );
}
