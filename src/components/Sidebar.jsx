import React from "react";
import { NavLink } from "react-router-dom";
import { MapPin, Activity, Users, Home, DollarSign } from "lucide-react";

export default function Sidebar() {
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
      <div className="p-4 text-xs text-slate-500 text-center">
        Sistem RT v1.0
      </div>
    </div>
  );
}
