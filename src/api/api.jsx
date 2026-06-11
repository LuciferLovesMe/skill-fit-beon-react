import axios from "axios";

// 1. Buat instance Axios dengan konfigurasi dasar
const api = axios.create({
  // Sesuaikan baseURL dengan URL Backend Laravel Anda
  baseURL: "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 2. REQUEST INTERCEPTOR: Dijalankan sebelum request dikirim ke server
api.interceptors.request.use(
  (config) => {
    // Ambil token dari localStorage
    const token = localStorage.getItem("token");

    // Jika token ada, sisipkan ke header Authorization
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Tangani error request jika ada
    return Promise.reject(error);
  },
);

// 3. RESPONSE INTERCEPTOR: Dijalankan ketika menerima response dari server
api.interceptors.response.use(
  (response) => {
    // Jika response sukses, langsung kembalikan data
    return response;
  },
  (error) => {
    // Jika server mengembalikan error 401 (Unauthorized)
    // Artinya token tidak valid, kedaluwarsa, atau user belum login
    if (error.response && error.response.status === 401) {
      console.error("Sesi Anda telah berakhir atau tidak valid.");

      // Hapus token yang tidak valid
      localStorage.removeItem("token");

      // Lempar user kembali ke halaman login
      // Kita menggunakan window.location agar langsung me-refresh state React
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default api;
