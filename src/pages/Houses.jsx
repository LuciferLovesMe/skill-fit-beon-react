import React, { useState } from "react";
import {
  Home,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  UserPlus,
  UserMinus,
  History,
  X,
} from "lucide-react";
import Modal from "../components/Modal";

// --- MOCK DATA ---
const mockResidents = [
  { id: 1, nama: "Budi Santoso", status: "tetap" },
  { id: 2, nama: "Siti Aminah", status: "kontrak" },
  { id: 3, nama: "Ahmad Dahlan", status: "tetap" },
  { id: 4, nama: "Joko Anwar", status: "kontrak" },
];

// Generate 20 Rumah Sesuai Soal
const initialMockHouses = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  nomor_blok: `Blok A-${String(i + 1).padStart(2, "0")}`,
  status_hunian: i < 15 ? "dihuni" : "tidak_dihuni",
  penghuni_aktif: i < 15 ? mockResidents[i % mockResidents.length] : null,
}));

export default function HousesPage() {
  // --- STATE MANAGEMENT ---
  const [houses, setHouses] = useState(initialMockHouses);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");

  // State Modal Form Rumah (Tambah/Edit)
  const [isHouseFormOpen, setIsHouseFormOpen] = useState(false);
  const [houseModalMode, setHouseModalMode] = useState("add"); // 'add' | 'edit'
  const [houseFormData, setHouseFormData] = useState({
    id: null,
    nomor_blok: "",
    status_hunian: "tidak_dihuni",
  });

  // State Modal Alokasi Penghuni (Assign/Remove)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    resident_id: "",
    tanggal_mulai: "",
  });

  // State Modal Hapus Rumah
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- HANDLERS: RUMAH ---
  const handleOpenAddHouse = () => {
    setHouseModalMode("add");
    setHouseFormData({
      id: null,
      nomor_blok: "",
      status_hunian: "tidak_dihuni",
    });
    setIsHouseFormOpen(true);
  };

  const handleOpenEditHouse = (house) => {
    setHouseModalMode("edit");
    setHouseFormData({
      id: house.id,
      nomor_blok: house.nomor_blok,
      status_hunian: house.status_hunian,
    });
    setIsHouseFormOpen(true);
  };

  const handleSaveHouse = (e) => {
    e.preventDefault();
    if (houseModalMode === "add") {
      const newHouse = {
        ...houseFormData,
        id: Date.now(),
        penghuni_aktif: null,
      };
      setHouses([...houses, newHouse]);
    } else {
      setHouses(
        houses.map((h) =>
          h.id === houseFormData.id
            ? { ...h, nomor_blok: houseFormData.nomor_blok }
            : h,
        ),
      );
    }
    setIsHouseFormOpen(false);
  };

  const handleDeleteHouse = () => {
    setHouses(houses.filter((h) => h.id !== selectedHouse.id));
    setIsDeleteOpen(false);
    setSelectedHouse(null);
  };

  // --- HANDLERS: ALOKASI PENGHUNI ---
  const handleOpenAssign = (house) => {
    setSelectedHouse(house);
    setAssignFormData({ resident_id: "", tanggal_mulai: "" });
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = (e) => {
    e.preventDefault();
    // Cari data resident dari mock
    const resident = mockResidents.find(
      (r) => r.id === parseInt(assignFormData.resident_id),
    );

    setHouses(
      houses.map((h) =>
        h.id === selectedHouse.id
          ? { ...h, status_hunian: "dihuni", penghuni_aktif: resident }
          : h,
      ),
    );
    setIsAssignModalOpen(false);
  };

  const handleRemoveResident = (houseId) => {
    if (window.confirm("Keluarkan penghuni dari rumah ini?")) {
      setHouses(
        houses.map((h) =>
          h.id === houseId
            ? { ...h, status_hunian: "tidak_dihuni", penghuni_aktif: null }
            : h,
        ),
      );
    }
  };

  // --- FILTER & SEARCH ---
  const filteredHouses = houses.filter((h) => {
    const matchSearch =
      h.nomor_blok.toLowerCase().includes(searchTerm.toLowerCase()) ||
      h.penghuni_aktif?.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchFilter =
      filterStatus === "semua" || h.status_hunian === filterStatus;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Button Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Rumah</h2>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data 20 rumah dan status huniannya
          </p>
        </div>
        <button
          onClick={handleOpenAddHouse}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Rumah Baru</span>
        </button>
      </div>

      {/* Toolbar: Search & Filter */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Cari nomor blok atau nama penghuni..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition bg-white"
          >
            <option value="semua">Semua Status</option>
            <option value="dihuni">Dihuni</option>
            <option value="tidak_dihuni">Kosong</option>
          </select>
        </div>
      </div>

      {/* GRID CARDS RUMAH */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
        {filteredHouses.length > 0 ? (
          filteredHouses.map((house) => (
            <div
              key={house.id}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative group hover:shadow-md transition-all duration-200"
            >
              {/* Dropdown Aksi (Kecil di pojok kanan atas) */}
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => handleOpenEditHouse(house)}
                    className="p-1.5 text-blue-600 hover:bg-blue-50 transition"
                    title="Edit Rumah"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedHouse(house);
                      setIsDeleteOpen(true);
                    }}
                    className="p-1.5 text-rose-600 hover:bg-rose-50 transition border-l border-gray-100"
                    title="Hapus Rumah"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Ikon & Info Rumah */}
              <div className="flex flex-col items-center text-center mt-2 mb-4">
                <div
                  className={`p-4 rounded-full mb-3 ${house.status_hunian === "dihuni" ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"}`}
                >
                  <Home className="w-8 h-8" />
                </div>
                <h3 className="font-bold text-gray-800 text-lg">
                  {house.nomor_blok}
                </h3>
                <span
                  className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                    house.status_hunian === "dihuni"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {house.status_hunian === "dihuni" ? "Dihuni" : "Kosong"}
                </span>
              </div>

              {/* Info Penghuni Aktif */}
              <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-1 border border-gray-100 text-center flex flex-col justify-center">
                {house.penghuni_aktif ? (
                  <>
                    <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                      Dihuni Oleh
                    </p>
                    <p
                      className="font-semibold text-gray-800 text-sm line-clamp-1"
                      title={house.penghuni_aktif.nama}
                    >
                      {house.penghuni_aktif.nama}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5 capitalize">
                      {house.penghuni_aktif.status}
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-gray-400 font-medium italic">
                    Tidak ada penghuni
                  </p>
                )}
              </div>

              {/* Action Buttons Bawah */}
              <div className="grid grid-cols-2 gap-2 mt-auto">
                {house.status_hunian === "dihuni" ? (
                  <button
                    onClick={() => handleRemoveResident(house.id)}
                    className="flex items-center justify-center space-x-1 py-2 rounded-lg bg-amber-50 text-amber-600 hover:bg-amber-100 transition text-xs font-semibold"
                  >
                    <UserMinus className="w-3.5 h-3.5" />
                    <span>Kosongkan</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleOpenAssign(house)}
                    className="flex items-center justify-center space-x-1 py-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition text-xs font-semibold"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>Isi Rumah</span>
                  </button>
                )}
                <button
                  className="flex items-center justify-center space-x-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-xs font-semibold"
                  title="Lihat Histori Penghuni"
                >
                  <History className="w-3.5 h-3.5" />
                  <span>Histori</span>
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
            Data rumah tidak ditemukan.
          </div>
        )}
      </div>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* 1. Modal Form Tambah/Edit Rumah */}
      <Modal
        isOpen={isHouseFormOpen}
        onClose={() => setIsHouseFormOpen(false)}
        title={
          houseModalMode === "add" ? "Tambah Data Rumah" : "Edit Data Rumah"
        }
      >
        <form onSubmit={handleSaveHouse} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Blok Rumah
            </label>
            <input
              type="text"
              required
              value={houseFormData.nomor_blok}
              onChange={(e) =>
                setHouseFormData({
                  ...houseFormData,
                  nomor_blok: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Contoh: Blok A-01"
            />
          </div>

          {houseModalMode === "add" && (
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              ℹ️ Rumah baru yang ditambahkan akan memiliki status default
              "Kosong". Anda bisa mengisi penghuninya melalui tombol "Isi Rumah"
              pada kartu rumah nanti.
            </p>
          )}

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsHouseFormOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
            >
              Simpan Rumah
            </button>
          </div>
        </form>
      </Modal>

      {/* 2. Modal Alokasi Penghuni (Assign Resident) */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Alokasi Penghuni Rumah"
      >
        <form onSubmit={handleSaveAssign} className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center space-x-4 mb-2">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Home className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Target Rumah</p>
              <p className="text-lg font-bold text-gray-800">
                {selectedHouse?.nomor_blok}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Warga / Penghuni Baru
            </label>
            <select
              required
              value={assignFormData.resident_id}
              onChange={(e) =>
                setAssignFormData({
                  ...assignFormData,
                  resident_id: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
            >
              <option value="" disabled>
                -- Pilih warga yang terdaftar --
              </option>
              {mockResidents.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama} ({r.status})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Mulai Menempati
            </label>
            <input
              type="date"
              required
              value={assignFormData.tanggal_mulai}
              onChange={(e) =>
                setAssignFormData({
                  ...assignFormData,
                  tanggal_mulai: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsAssignModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition font-medium"
            >
              Konfirmasi Penempatan
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal Konfirmasi Hapus Rumah */}
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
          <h3 className="text-xl font-bold text-gray-800 mb-2">Hapus Rumah?</h3>
          <p className="text-sm text-gray-500 mb-6">
            Yakin ingin menghapus <strong>{selectedHouse?.nomor_blok}</strong>{" "}
            dari sistem? Aksi ini akan menghapus semua riwayat yang terkait
            dengan rumah ini.
          </p>
          <div className="flex space-x-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              onClick={handleDeleteHouse}
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
