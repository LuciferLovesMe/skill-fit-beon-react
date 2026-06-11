import React, { useState } from "react";
import { MapPin, Lock, Mail, ArrowRight, Activity } from "lucide-react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Simulasi proses API (Nantinya diganti dengan Axios)
    setTimeout(() => {
      // Mock validasi sederhana
      if (email === "admin@rt.com" && password === "password123") {
        // Berhasil login
        // Di integrasi nyata: simpan token ke localStorage lalu redirect
        // localStorage.setItem('token', 'dummy-token');
        // navigate('/');
        alert(
          "Simulasi Login Berhasil! (Di project nyata akan dialihkan ke Dashboard)",
        );
      } else {
        setError("Email atau password tidak sesuai.");
      }
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans relative overflow-hidden">
      {/* Background Ornamen */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-100/50 blur-[120px]"></div>
        <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-emerald-100/50 blur-[100px]"></div>
      </div>

      <div className="w-full max-w-[1000px] bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col md:flex-row relative z-10 border border-slate-100">
        {/* Bagian Kiri: Info Panel */}
        <div className="md:w-5/12 bg-slate-900 text-white p-10 flex flex-col justify-between relative overflow-hidden hidden md:flex">
          {/* Aksen Biru di pojok */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-emerald-400"></div>
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>

          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-12">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <h1 className="text-2xl font-bold tracking-wider">Admin RT</h1>
            </div>

            <h2 className="text-3xl font-bold leading-tight mb-4">
              Sistem Pengelolaan
              <br />
              <span className="text-blue-400">Administrasi Warga</span>
            </h2>
            <p className="text-slate-400 text-sm leading-relaxed mb-8 max-w-sm">
              Platform terpadu untuk memantau data hunian, warga, serta arus kas
              dan iuran perumahan dengan mudah dan transparan.
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-emerald-400" />
                </div>
                <span>Pantau Arus Kas Real-time</span>
              </div>
              <div className="flex items-center space-x-3 text-slate-300 text-sm">
                <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center">
                  <Users className="w-4 h-4 text-blue-400" />
                </div>
                <span>Manajemen Warga & Rumah</span>
              </div>
            </div>
          </div>

          <div className="relative z-10 mt-12 pt-8 border-t border-slate-800 flex items-center justify-between">
            <p className="text-xs text-slate-500">
              © 2026 Beon Intermedia Test
            </p>
            <p className="text-xs text-slate-500">v1.0</p>
          </div>
        </div>

        {/* Bagian Kanan: Login Form */}
        <div className="md:w-7/12 p-8 md:p-14 flex items-center justify-center bg-white relative">
          <div className="w-full max-w-md">
            {/* Header Mobile Only */}
            <div className="flex items-center space-x-3 mb-8 md:hidden">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <MapPin className="text-white w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-slate-900 tracking-wider">
                Admin RT
              </h1>
            </div>

            <div className="mb-10 text-center md:text-left">
              <h3 className="text-2xl font-bold text-slate-800 mb-2">
                Selamat Datang Kembali
              </h3>
              <p className="text-slate-500 text-sm">
                Masuk ke akun administrator Anda untuk melanjutkan.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Alert Error */}
              {error && (
                <div className="p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-sm flex items-center animate-in slide-in-from-top-2">
                  <div className="w-2 h-2 bg-rose-500 rounded-full mr-3 shrink-0"></div>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                {/* Input Email */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Alamat Email
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all sm:text-sm"
                      placeholder="admin@rt.com"
                    />
                  </div>
                </div>

                {/* Input Password */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Kata Sandi
                    </label>
                  </div>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                    </div>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white outline-none transition-all sm:text-sm"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Teks Bantuan Simulasi (Bisa dihapus nanti) */}
              <div className="text-xs text-center text-slate-500 bg-slate-50 py-2 rounded-lg border border-slate-100">
                Gunakan <strong>admin@rt.com</strong> dan{" "}
                <strong>password123</strong> untuk simulasi login.
              </div>

              {/* Button Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-bold text-white transition-all
                  ${isLoading ? "bg-blue-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5"}`}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Memverifikasi...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <span>Masuk ke Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// === KOMPONEN ICON TAMBAHAN ===
// Karena 'Users' tidak terimport di atas (hanya simulasi)
function Users(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
