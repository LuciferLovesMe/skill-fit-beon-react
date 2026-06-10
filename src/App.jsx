import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Residents from "./pages/Residents";
import Houses from "./pages/Houses"; // Pastikan file ini dibuat
import Finance from "./pages/Finance"; // Pastikan file ini dibuat

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="residents" element={<Residents />} />
          <Route path="houses" element={<Houses />} />
          <Route path="finance" element={<Finance />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
