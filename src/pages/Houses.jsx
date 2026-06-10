import React from "react";
import { Plus } from "lucide-react";
import Table from "../components/Table"; // Import komponen tabel yang baru dibuat

export default function Residents() {
  // 1. Data (Nantinya diganti dengan state dari Axios Laravel)
  const mockResidents = [
    {
      id: 1,
      nama: "Budi Santoso",
      status: "tetap",
      telp: "081234567890",
      nikah: "sudah",
    },
    {
      id: 2,
      nama: "Siti Aminah",
      status: "kontrak",
      telp: "081987654321",
      nikah: "belum",
    },
  ];

  // 2. Definisi Kolom Tabel
  const tableColumns = [
    { header: "Nama Lengkap", accessor: "nama" },
    {
      header: "Status Hunian",
      // Menggunakan custom render untuk menampilkan badge warna-warni
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${row.status === "tetap" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}
        >
          {row.status.toUpperCase()}
        </span>
      ),
    },
    { header: "No. Telepon", accessor: "telp" },
    {
      header: "Status Menikah",
      render: (row) => (row.nikah === "sudah" ? "Menikah" : "Lajang"),
    },
    {
      header: "Aksi",
      render: (row) => (
        <button
          onClick={() => alert(`Edit user: ${row.nama}`)}
          className="text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          Edit
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Penghuni</h2>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition">
          <Plus className="w-4 h-4" />
          <span>Tambah Penghuni</span>
        </button>
      </div>

      {/* 3. Panggil Komponen Table dan kirimkan props-nya! */}
      <Table columns={tableColumns} data={mockResidents} />
    </div>
  );
}
