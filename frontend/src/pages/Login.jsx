import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import { PublicNavbar } from "../components/PublicLayout";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await axiosClient.post("/login", {
        email,
        password
      });

      // Simpan token ke localStorage via AuthContext
      login(response.data.access_token);
      
      console.log("Login berhasil:", response.data);
      
      // Redirect sesuai role
      const role = response.data.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "owner") {
        navigate("/owner/dashboard");
      } else {
        // Default ke customer dashboard
        navigate("/user/beranda");
      }
    } catch (err) {
      console.error("Gagal login:", err);
      setError(
        err.response?.data?.detail || "Terjadi kesalahan saat mencoba masuk."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <PublicNavbar />
      <div className="min-h-screen w-full flex items-center justify-center bg-transparent p-4 pt-24 sm:p-8 sm:pt-28 lg:p-[72px_64px] lg:pt-[120px] font-inter">
      <div className="w-full max-w-[1152px] rounded-[20px] bg-white shadow-[0_32px_64px_-16px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col lg:grid lg:grid-cols-12 min-h-[600px] lg:min-h-[880px]">

        {/* Left Column — Brand Imagery (7 columns) */}
        <div className="hidden lg:flex lg:col-span-7 relative min-h-[880px] overflow-hidden">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/d92c5c87884f8d49db1d3624d9a512fc4d1fd3e7?width=1344"
            alt="Elegant Salon Interior"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div
            className="absolute inset-0"
            style={{ background: "linear-gradient(45deg, rgba(219,39,119,0.80) 0%, rgba(219,39,119,0.20) 50%, transparent 100%)" }}
          />
          <div className="relative z-10 flex flex-col justify-end p-16 h-full">
            <div className="flex items-center gap-2 px-4 py-1 rounded-full border border-white/20 bg-white/10 backdrop-blur-[6px] w-fit mb-4">
              <div className="w-2 h-2 rounded-full bg-[#EFE4A2] shrink-0" />
              <span className="text-white/90 font-semibold text-sm tracking-[1.4px] uppercase">
                PREMIUM EXPERIENCE
              </span>
            </div>
            <h1 className="text-white font-bold text-[48px] leading-[60px] tracking-[-0.96px] mb-4 drop-shadow-sm">
              GlowUp
            </h1>
            <p className="text-white/90 font-light text-lg leading-[1.625] max-w-[512px]">
              Masuki dunia kecantikan eksklusif. Kelola janji temu dan nikmati layanan premium dalam satu genggaman digital yang elegan.
            </p>
          </div>
        </div>

        {/* Right Column — Login Form (5 columns) */}
        <div className="col-span-5 flex flex-col justify-center items-center px-6 py-10 sm:px-10 lg:px-16 lg:py-[103px] bg-white">
          {/* Mobile brand badge */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <span className="text-glowup-brand font-bold text-2xl tracking-tight">GlowUp</span>
          </div>

          <div className="w-full max-w-[448px] pt-2 flex flex-col gap-10">

            {/* Header */}
            <div className="flex flex-col gap-[7px]">
              <h2 className="text-glowup-text font-bold text-[36px] leading-[1.3] tracking-[-0.9px]">
                Selamat Datang
              </h2>
              <p className="text-glowup-muted font-light text-base leading-[1.6]">
                Silakan masuk ke akun Anda untuk mulai memanjakan diri.
              </p>
            </div>

            {/* Error Message Display */}
            {error && (
              <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Form */}
            <form className="flex flex-col gap-6" onSubmit={handleLogin}>

              {/* Email Field */}
              <div className="flex flex-col gap-2">
                <label className="text-glowup-label font-medium text-sm tracking-[0.14px]">
                  Alamat Email
                </label>
                <div className="relative">
                  <input
                    type="email"
                    placeholder="nama@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-4 rounded-[20px] border border-[rgba(210,195,199,0.30)] bg-glowup-input text-base text-glowup-text placeholder:text-[rgba(210,195,199,0.60)] outline-none focus:border-glowup-brand transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <svg width="19" height="15" viewBox="0 0 19 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.80768 14.9999C1.30255 14.9999 0.874992 14.8249 0.524995 14.4749C0.174998 14.1249 0 13.6974 0 13.1922V1.80768C0 1.30255 0.174998 0.874992 0.524995 0.524995C0.874992 0.174998 1.30255 0 1.80768 0H17.1922C17.6974 0 18.1249 0.174998 18.4749 0.524995C18.8249 0.874992 18.9999 1.30255 18.9999 1.80768V13.1922C18.9999 13.6974 18.8249 14.1249 18.4749 14.4749C18.1249 14.8249 17.6974 14.9999 17.1922 14.9999H1.80768ZM9.49996 8.05762L1.49996 2.94223V13.1922C1.49996 13.282 1.52881 13.3557 1.58651 13.4134C1.6442 13.4711 1.71793 13.5 1.80768 13.5H17.1922C17.282 13.5 17.3557 13.4711 17.4134 13.4134C17.4711 13.3557 17.5 13.282 17.5 13.1922V2.94223L9.49996 8.05762ZM9.49996 6.49996L17.3461 1.49996H1.65382L9.49996 6.49996Z" fill="#D2C3C7"/>
                    </svg>
                  </span>
                </div>
              </div>

              {/* Password Field */}
              <div className="flex flex-col gap-2 pb-[16px]">
                <div className="flex justify-between items-center px-1">
                  <label className="text-glowup-label font-medium text-sm tracking-[0.14px]">
                    Kata Sandi
                  </label>
                  <a href="#" className="text-glowup-brand font-semibold text-sm tracking-[0.14px] hover:opacity-80 transition-opacity">
                    Lupa Password?
                  </a>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-14 py-4 rounded-[20px] border border-[rgba(210,195,199,0.30)] bg-glowup-input text-base text-glowup-text placeholder:text-[rgba(210,195,199,0.60)] outline-none focus:border-glowup-brand transition-colors"
                  />
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none flex items-center">
                    <svg width="15" height="20" viewBox="0 0 15 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M1.80768 19.4999C1.30896 19.4999 0.883006 19.3233 0.529803 18.9701C0.176601 18.6169 0 18.1909 0 17.6922V8.30764C0 7.80893 0.176601 7.38297 0.529803 7.02977C0.883006 6.67656 1.30896 6.49996 1.80768 6.49996H3V4.49996C3 3.25126 3.43782 2.18908 4.31345 1.31345C5.18908 0.437817 6.25126 0 7.49996 0C8.74867 0 9.81084 0.437817 10.6865 1.31345C11.5621 2.18908 11.9999 3.25126 11.9999 4.49996V6.49996H13.1922C13.691 6.49996 14.1169 6.67656 14.4701 7.02977C14.8233 7.38297 14.9999 7.80893 14.9999 8.30764V17.6922C14.9999 18.1909 14.8233 18.6169 14.4701 18.9701C14.1169 19.3233 13.691 19.4999 13.1922 19.4999H1.80768ZM1.80768 17.9999H13.1922C13.282 17.9999 13.3557 17.9711 13.4134 17.9134C13.4711 17.8557 13.5 17.782 13.5 17.6922V8.30764C13.5 8.21789 13.4711 8.14417 13.4134 8.08647C13.3557 8.02878 13.282 7.99993 13.1922 7.99993H1.80768C1.71793 7.99993 1.6442 8.02878 1.58651 8.08647C1.52881 8.14417 1.49996 8.21789 1.49996 8.30764V17.6922C1.49996 17.782 1.52881 17.8557 1.58651 17.9134C1.6442 17.9711 1.71793 17.9999 1.80768 17.9999ZM7.49996 14.7499C7.98586 14.7499 8.39899 14.5797 8.73937 14.2393C9.07975 13.899 9.24994 13.4858 9.24994 12.9999C9.24994 12.514 9.07975 12.1009 8.73937 11.7605C8.39899 11.4201 7.98586 11.2499 7.49996 11.2499C7.01407 11.2499 6.60093 11.4201 6.26055 11.7605C5.92017 12.1009 5.74998 12.514 5.74998 12.9999C5.74998 13.4858 5.92017 13.899 6.26055 14.2393C6.60093 14.5797 7.01407 14.7499 7.49996 14.7499ZM4.49996 6.49996H10.5V4.49996C10.5 3.66663 10.2083 2.9583 9.62496 2.37496C9.04163 1.79163 8.3333 1.49996 7.49996 1.49996C6.66663 1.49996 5.9583 1.79163 5.37496 2.37496C4.79163 2.9583 4.49996 3.66663 4.49996 4.49996V6.49996Z" fill="#D2C3C7"/>
                    </svg>
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 flex items-center justify-center"
                    aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                  >
                    <svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.7198 9.23071C9.66405 9.23071 10.466 8.90023 11.1258 8.23925C11.7855 7.57828 12.1153 6.77567 12.1153 5.83142C12.1153 4.88717 11.7848 4.08519 11.1239 3.42547C10.4629 2.76575 9.66028 2.43589 8.71603 2.43589C7.77178 2.43589 6.9698 2.76638 6.31008 3.42735C5.65036 4.08833 5.32051 4.89094 5.32051 5.83519C5.32051 6.77944 5.65099 7.58142 6.31197 8.24114C6.97294 8.90086 7.77555 9.23071 8.7198 9.23071ZM8.71792 8.0833C8.09292 8.0833 7.56167 7.86455 7.12417 7.42705C6.68667 6.98955 6.46792 6.4583 6.46792 5.8333C6.46792 5.2083 6.68667 4.67705 7.12417 4.23955C7.56167 3.80205 8.09292 3.5833 8.71792 3.5833C9.34292 3.5833 9.87417 3.80205 10.3117 4.23955C10.7492 4.67705 10.9679 5.2083 10.9679 5.8333C10.9679 6.4583 10.7492 6.98955 10.3117 7.42705C9.87417 7.86455 9.34292 8.0833 8.71792 8.0833ZM8.71906 11.6666C6.80271 11.6666 5.05661 11.138 3.48076 10.0809C1.90491 9.02372 0.744658 7.60787 0 5.8333C0.744658 4.05874 1.90453 2.64288 3.47961 1.58573C5.0547 0.528576 6.80042 0 8.71677 0C10.6331 0 12.3792 0.528576 13.9551 1.58573C15.5309 2.64288 16.6912 4.05874 17.4358 5.8333C16.6912 7.60787 15.5313 9.02372 13.9562 10.0809C12.3811 11.138 10.6354 11.6666 8.71906 11.6666ZM8.71792 10.4166C10.2874 10.4166 11.7283 10.0034 13.0408 9.17705C14.3533 8.35066 15.3568 7.23608 16.0512 5.8333C15.3568 4.43053 14.3533 3.31594 13.0408 2.48955C11.7283 1.66316 10.2874 1.24997 8.71792 1.24997C7.14847 1.24997 5.7075 1.66316 4.395 2.48955C3.0825 3.31594 2.07903 4.43053 1.38458 5.8333C2.07903 7.23608 3.0825 8.35066 4.395 9.17705C5.7075 10.0034 7.14847 10.4166 8.71792 10.4166Z" fill="#D2C3C7"/>
                    </svg>
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex items-center justify-center gap-3 py-4 px-6 rounded-[20px] font-semibold text-base text-glowup-dark hover:opacity-90 active:opacity-80 transition-opacity bg-glow-gradient ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                <span>{isLoading ? "Memproses..." : "Masuk Ke Akun"}</span>
                {!isLoading && (
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.09519 6.18746H0V5.06249H9.09519L4.82307 0.790366L5.62497 0L11.2499 5.62497L5.62497 11.2499L4.82307 10.4596L9.09519 6.18746Z" fill="#2E1221"/>
                  </svg>
                )}
              </button>
            </form>



            {/* Registration Footer */}
            <div className="flex items-center justify-center gap-1 flex-wrap pb-1">
              <span className="text-glowup-muted font-light text-base">Belum punya akun?</span>
              <Link to="/register" className="text-glowup-brand font-bold text-base hover:opacity-80 transition-opacity">
                Daftar Sekarang
              </Link>
            </div>

          </div>
        </div>

      </div>
    </div>
    </>
  );
}
