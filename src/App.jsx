import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Link,
  Outlet,
} from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Houses from "./pages/Houses"; // Pastikan file ini dibuat
import Finance from "./pages/Finance"; // Pastikan file ini dibuat
import Login from "./pages/Login";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ==========================================
            RUTE PUBLIK
        ========================================== */}
        <Route path="/login" element={<Login />} />

        {/* ==========================================
            RUTE TERPROTEKSi (Wajib Login)
        ========================================== */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Outlet dari Layout akan diisi oleh rute-rute di bawah ini */}
          <Route index element={<Dashboard />} />
          <Route path="residents" element={<Residents />} />
          <Route path="houses" element={<Houses />} />
          <Route path="finance" element={<Finance />} />
        </Route>

        {/* ==========================================
            RUTE FALLBACK (404)
            Jika user mengetik URL ngawur, kembalikan ke Dashboard
        ========================================== */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
