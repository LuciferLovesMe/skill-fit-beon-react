import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function Layout() {
  const location = useLocation();

  // Mengambil nama rute untuk Header
  const getPageName = () => {
    switch (location.pathname) {
      case "/":
        return "Dashboard";
      case "/residents":
        return "Kelola Penghuni";
      case "/houses":
        return "Kelola Rumah";
      case "/finance":
        return "Keuangan & Iuran";
      default:
        return "Dashboard";
    }
  };

  return (
    <div className="flex min-h-screen font-sans bg-slate-50">
      <Sidebar />
      <main className="flex-1 ml-64 flex flex-col">
        {/* Header App */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <div className="text-gray-500 text-sm font-medium">
            Sistem Informasi <span className="mx-2">/</span>{" "}
            <span className="text-gray-800 font-bold">{getPageName()}</span>
          </div>
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-bold text-gray-800">Bapak RT</p>
              <p className="text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
              RT
            </div>
          </div>
        </header>

        {/* Dynamic Content (Pages akan dirender di sini) */}
        <div className="p-8 flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
