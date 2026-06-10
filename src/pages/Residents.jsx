import React, { useState } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
} from "lucide-react";
import Table from "../components/Table"; // Import komponen tabel yang baru dibuat
import Modal from "../components/Modal";

const initialMockResidents = [
  {
    id: 1,
    nama: "Budi Santoso",
    status: "tetap",
    telp: "081234567890",
    nikah: "sudah",
    foto: "ktp-budi.jpg",
  },
  {
    id: 2,
    nama: "Siti Aminah",
    status: "kontrak",
    telp: "081987654321",
    nikah: "belum",
    foto: null,
  },
  {
    id: 3,
    nama: "Ahmad Dahlan",
    status: "tetap",
    telp: "081299887766",
    nikah: "sudah",
    foto: null,
  },
];

export default function ResidentsPage() {
  // --- STATE MANAGEMENT ---
  const [residents, setResidents] = useState(initialMockResidents);
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const initialFormState = {
    id: null,
    nama: "",
    status: "tetap",
    telp: "",
    nikah: "belum",
    foto: null,
  };
  const [formData, setFormData] = useState(initialFormState);

  // State Modal Hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (resident) => {
    setModalMode("edit");
    setFormData(resident);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (modalMode === "add") {
      const newResident = { ...formData, id: Date.now() };
      setResidents([newResident, ...residents]);
    } else {
      setResidents(residents.map((r) => (r.id === formData.id ? formData : r)));
    }
    handleCloseForm();
  };

  const handleDelete = () => {
    setResidents(residents.filter((r) => r.id !== residentToDelete.id));
    setIsDeleteOpen(false);
    setResidentToDelete(null);
  };

  const tableColumns = [
    {
      label: "Nama Lengkap",
      render: (r) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shrink-0">
            {r.foto ? (
              <div className="w-full h-full bg-blue-100 text-blue-500 flex items-center justify-center text-xs">
                IMG
              </div>
            ) : (
              r.nama.charAt(0)
            )}
          </div>
          <span className="font-medium text-gray-800">{r.nama}</span>
        </div>
      ),
    },
    {
      label: "Status Hunian",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            r.status === "tetap"
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {r.status.toUpperCase()}
        </span>
      ),
    },
    {
      label: "No. Telepon",
      accessor: "telp", // Langsung ambil field 'telp' tanpa custom render
    },
    {
      label: "Status Menikah",
      render: (r) => (r.nikah === "sudah" ? "Menikah" : "Belum Menikah"),
    },
    {
      label: "Aksi",
      render: (r) => (
        <div className="flex opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => handleOpenEdit(r)}
            className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
            title="Edit"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => {
              setResidentToDelete(r);
              setIsDeleteOpen(true);
            }}
            className="p-2 text-rose-600 hover:bg-rose-100 rounded-lg transition"
            title="Hapus"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  // Pencarian
  const filteredResidents = residents.filter(
    (r) =>
      r.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.telp.includes(searchTerm),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Button Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Daftar Penghuni</h2>
        <button
          onClick={handleOpenAdd}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Penghuni</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nama atau no. telepon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2 transition shrink-0">
          <Filter className="w-4 h-4" />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Tabel Data */}
      {/* IMPLEMENTASI KOMPONEN TABEL REUSABLE */}
      <Table
        columns={tableColumns}
        data={filteredResidents}
        emptyMessage="Data penghuni tidak ditemukan."
      />

      {/* FORM MODAL */}
      <Modal
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        title={
          modalMode === "add" ? "Tambah Penghuni Baru" : "Edit Data Penghuni"
        }
      >
        <form onSubmit={handleSave} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="nama"
              required
              value={formData.nama}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Masukkan nama sesuai KTP"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                No. Telepon
              </label>
              <input
                type="text"
                name="telp"
                required
                value={formData.telp}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
                placeholder="08123456..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status Pernikahan
              </label>
              <select
                name="nikah"
                value={formData.nikah}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                <option value="belum">Belum Menikah</option>
                <option value="sudah">Sudah Menikah</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Hunian
            </label>
            <div className="flex space-x-4 mt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="tetap"
                  checked={formData.status === "tetap"}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Penghuni Tetap</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value="kontrak"
                  checked={formData.status === "kontrak"}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">
                  Kontrak / Sementara
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Foto KTP
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition cursor-pointer">
              <div className="space-y-1 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none">
                    <span>Upload file</span>
                    <input type="file" className="sr-only" accept="image/*" />
                  </label>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG up to 2MB</p>
                {formData.foto && (
                  <p className="text-xs text-emerald-600 font-medium mt-2">
                    ✓ File: {formData.foto}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={handleCloseForm}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
            >
              Simpan Data
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        title="Konfirmasi Hapus"
        maxWidth="max-w-sm"
      >
        <div className="p-6 text-center">
          <div className="w-16 h-16 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trash2 className="w-8 h-8" />
          </div>
          <p className="text-sm text-gray-600 mb-6">
            Yakin ingin menghapus data <strong>{residentToDelete?.nama}</strong>
            ? Aksi ini tidak bisa di-undo.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDelete}
              className="flex-1 px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition font-medium"
            >
              Ya, Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
