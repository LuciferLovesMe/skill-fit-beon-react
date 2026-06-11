import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  MapPin,
  Activity,
  Users,
  Home,
  DollarSign,
  LogOut,
} from "lucide-react";

export default function Sidebar() {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // --- FUNGSI LOGOUT ---
  const handleLogout = () => {
    setIsLoggingOut(true);

    setTimeout(() => {
      localStorage.removeItem("token");
      // Refresh dan arahkan ke login agar state global bersih
      window.location.href = "/login";
    }, 600);
  };
  const menuItems = [
    { path: "/", icon: Activity, label: "Dashboard" },
    { path: "/residents", icon: Users, label: "Kelola Penghuni" },
    { path: "/houses", icon: Home, label: "Kelola Rumah" },
    { path: "/finance", icon: DollarSign, label: "Keuangan & Iuran" },
  ];

  return (
    <div className="w-64 bg-slate-900 text-white min-h-screen flex flex-col transition-all fixed">
      <div className="p-6 flex items-center space-x-3">
        <MapPin className="text-blue-400 w-8 h-8" />
        <h1 className="text-xl font-bold tracking-wider">Admin RT</h1>
      </div>
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-colors ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <button
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="w-full flex items-center justify-between px-4 py-3 text-rose-400 hover:bg-rose-500/10 rounded-xl text-sm font-medium transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5 text-rose-500/70 group-hover:text-rose-400 transition-colors" />
            <span>{isLoggingOut ? "Keluar..." : "Keluar Aplikasi"}</span>
          </div>
        </button>
      </div>
      <div className="p-4 text-xs text-slate-500 text-center">
        Sistem RT v1.0
      </div>
    </div>
  );
}
