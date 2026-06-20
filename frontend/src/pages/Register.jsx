import { useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";
import { PublicNavbar } from "../components/PublicLayout";

export default function Index() {
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  
  // State untuk form input
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);

    if (!agreed) {
      setError("Anda harus menyetujui Syarat & Ketentuan.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosClient.post("/register", {
        name,
        email,
        password,
        role: "customer" // Default role
      });
      
      console.log("Registrasi berhasil:", response.data);
      // Redirect ke halaman login setelah registrasi sukses
      navigate("/login"); 
    } catch (err) {
      console.error("Gagal mendaftar:", err);
      setError(
        err.response?.data?.detail || "Terjadi kesalahan saat melakukan pendaftaran."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-inter" style={{ background: "transparent" }}>
      <PublicNavbar />
      {/* Background blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-48 -left-32 w-[600px] h-[500px] rounded-full opacity-70"
          style={{
            background: "rgba(255, 216, 231, 0.30)",
            filter: "blur(80px)",
          }}
        />
        <div
          className="absolute -bottom-48 -right-32 w-[600px] h-[500px] rounded-full opacity-70"
          style={{
            background: "rgba(239, 228, 162, 0.30)",
            filter: "blur(80px)",
          }}
        />
      </div>

      {/* Main content */}
      <main className="flex-1 relative z-10 pt-24">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

            {/* Left: Visual content */}
            <div className="lg:col-span-7 flex flex-col gap-10 lg:pr-16">

              {/* Brand & Heading */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <h1
                    className="text-5xl sm:text-6xl font-extrabold leading-tight tracking-[-2.8px]"
                    style={{ color: "#795465" }}
                  >
                    GlowUp
                  </h1>
                  <div
                    className="w-32 h-1.5 rounded-full"
                    style={{
                      background: "linear-gradient(93deg, #F8C8DC 0%, #EFE4A2 100%)",
                    }}
                  />
                </div>

                <h2
                  className="text-3xl sm:text-4xl lg:text-[40px] font-bold leading-[1.25] tracking-[-0.4px] max-w-xl"
                  style={{ color: "#4F4448" }}
                >
                  Awali Perjalanan Kecantikan Anda Bersama Kami.
                </h2>

                <p
                  className="text-base sm:text-lg font-light leading-relaxed max-w-lg"
                  style={{ color: "#5E5F5B", lineHeight: "1.6" }}
                >
                  Temukan layanan salon premium dan kelola Booking Anda dengan kemudahan teknologi masa kini yang eksklusif untuk Anda.
                </p>
              </div>

              {/* Image section */}
              <div className="flex flex-col relative">
                <div
                  className="rounded-[20px] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.12)]"
                  style={{
                    border: "1px solid rgba(255, 255, 255, 0.40)",
                    background: "rgba(255, 255, 255, 0.00)",
                    aspectRatio: "4/3",
                  }}
                >
                  <img
                    src="https://api.builder.io/api/v1/image/assets/TEMP/9a235c3d3a80309051d8a4b05d149a4a8966dbe9?width=1123"
                    alt="A luxurious high-end beauty salon interior"
                    className="w-full h-full object-cover"
                  />
                </div>


              </div>
            </div>

            {/* Right: Registration form */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
              <div
                className="w-full max-w-[520px] flex flex-col gap-10 rounded-[20px] px-8 sm:px-10 py-10 sm:py-12"
                style={{
                  border: "1px solid rgba(255, 255, 255, 0.50)",
                  background: "rgba(255, 255, 255, 0.85)",
                  backdropFilter: "blur(12px)",
                }}
              >
                {/* Form header */}
                <div className="flex flex-col gap-2">
                  <h3
                    className="text-2xl sm:text-[28px] font-bold leading-tight"
                    style={{ color: "#1B1C1C" }}
                  >
                    Buat Akun Baru
                  </h3>
                  <p
                    className="text-base font-light leading-relaxed"
                    style={{ color: "#5E5F5B", lineHeight: "1.6" }}
                  >
                    Silakan lengkapi data di bawah ini untuk mendaftar.
                  </p>
                </div>
                
                {/* Error Message Display */}
                {error && (
                  <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                {/* Form fields */}
                <form className="flex flex-col gap-6" onSubmit={handleRegister}>

                  {/* Name */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="pl-1 text-sm font-medium tracking-[0.14px]"
                      style={{ color: "#4F4448" }}
                      htmlFor="name"
                    >
                      Nama Lengkap
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="20" viewBox="0 0 16 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z" fill="#817478" fillOpacity="0.6" />
                        </svg>
                      </span>
                      <input
                        id="name"
                        type="text"
                        placeholder="Masukkan nama lengkap"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-[18px] rounded-[20px] text-base outline-none transition-all focus:ring-2"
                        style={{
                          border: "1px solid rgba(210, 195, 199, 0.30)",
                          background: "rgba(255, 255, 255, 0.40)",
                          color: "#1B1C1C",
                          ringColor: "#795465",
                        }}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="pl-1 text-sm font-medium tracking-[0.14px]"
                      style={{ color: "#4F4448" }}
                      htmlFor="email"
                    >
                      Email
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="20" height="16" viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z" fill="#817478" fillOpacity="0.6" />
                        </svg>
                      </span>
                      <input
                        id="email"
                        type="email"
                        placeholder="contoh@email.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full pl-12 pr-4 py-[18px] rounded-[20px] text-base outline-none transition-all focus:ring-2"
                        style={{
                          border: "1px solid rgba(210, 195, 199, 0.30)",
                          background: "rgba(255, 255, 255, 0.40)",
                          color: "#1B1C1C",
                        }}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="flex flex-col gap-1">
                    <label
                      className="pl-1 text-sm font-medium tracking-[0.14px]"
                      style={{ color: "#4F4448" }}
                      htmlFor="password"
                    >
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg width="16" height="21" viewBox="0 0 16 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z" fill="#817478" fillOpacity="0.6" />
                        </svg>
                      </span>
                      <input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Minimal 8 karakter"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={8}
                        className="w-full pl-12 pr-12 py-[18px] rounded-[20px] text-base outline-none transition-all focus:ring-2"
                        style={{
                          border: "1px solid rgba(210, 195, 199, 0.30)",
                          background: "rgba(255, 255, 255, 0.40)",
                          color: "#1B1C1C",
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer"
                        aria-label="Toggle password visibility"
                      >
                        <svg width="22" height="15" viewBox="0 0 22 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z" fill="#817478" fillOpacity="0.6" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Terms & Conditions */}
                  <div className="flex items-start gap-3 px-1">
                    <div className="pt-1 shrink-0">
                      <button
                        type="button"
                        role="checkbox"
                        aria-checked={agreed}
                        onClick={() => setAgreed(!agreed)}
                        className="w-5 h-5 rounded-[6px] border flex items-center justify-center transition-all cursor-pointer"
                        style={{
                          borderColor: agreed ? "#795465" : "#D2C3C7",
                          background: agreed ? "#795465" : "#FFF",
                        }}
                      >
                        {agreed && (
                          <svg width="12" height="10" viewBox="0 0 12 10" fill="none">
                            <path d="M1 5L4.5 8.5L11 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </button>
                    </div>
                    <p className="text-[13px] leading-[1.625]" style={{ color: "#4F4448" }}>
                      Saya menyetujui{" "}
                      <a href="#" className="font-semibold hover:underline" style={{ color: "#795465" }}>
                        Syarat & Ketentuan
                      </a>{" "}
                      serta{" "}
                      <a href="#" className="font-semibold hover:underline" style={{ color: "#795465" }}>
                        Kebijakan Privasi
                      </a>{" "}
                      yang berlaku di GlowUp.
                    </p>
                  </div>

                  {/* Submit */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`w-full py-4 rounded-[20px] text-lg font-bold text-center transition-opacity hover:opacity-90 active:opacity-80 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                      style={{
                        background: "linear-gradient(100deg, #F8C8DC 0%, #EFE4A2 100%)",
                        color: "#2E1221",
                      }}
                    >
                      {isLoading ? "Memproses..." : "Daftar Sekarang"}
                    </button>
                  </div>

                  {/* Login link */}
                  <p className="text-center text-base font-medium mt-4 pb-2" style={{ color: "#4F4448" }}>
                    Sudah memiliki akun?{" "}
                    <a href="/login" className="font-bold hover:underline" style={{ color: "#795465" }}>
                      Masuk ke Akun
                    </a>
                  </p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </main>

      {/* Footer */}
      <footer
        className="relative z-10 border-t py-10"
        style={{
          borderColor: "rgba(210, 195, 199, 0.10)",
          background: "rgba(255, 255, 255, 0.50)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div className="max-w-[1440px] mx-auto px-4 sm:px-8 lg:px-16 flex flex-col items-center justify-center gap-2 text-center">
          <p className="text-sm font-semibold tracking-[0.14px]" style={{ color: "#5E5F5B" }}>
            © 2026 GlowUp. Semua Hak Dilindungi.
          </p>
          <p className="text-xs font-medium" style={{ color: "rgba(94, 95, 91, 0.60)" }}>
            Estetika Premium untuk Setiap Langkah Anda.
          </p>
        </div>
      </footer>
    </div>
  );
}
