import React, { useState, useEffect } from "react";
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
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Modal from "../components/Modal";
import api from "../api/api";

export default function HousesPage() {
  // --- STATE MANAGEMENT ---
  const [houses, setHouses] = useState([]);
  const [residentsList, setResidentsList] = useState([]); // Untuk dropdown assign
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("semua");
  const [isLoading, setIsLoading] = useState(true);

  // State Form Tambah/Edit Rumah
  const [isHouseFormOpen, setIsHouseFormOpen] = useState(false);
  const [houseModalMode, setHouseModalMode] = useState("add");
  const [houseFormData, setHouseFormData] = useState({
    id: null,
    block_number: "",
    is_occupied: "0",
  });

  // State Form Alokasi Penghuni (Assign)
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedHouse, setSelectedHouse] = useState(null);
  const [assignFormData, setAssignFormData] = useState({
    resident_id: "",
    start_date: "",
  });

  // State Form Kosongkan Rumah (Remove)
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [removeFormData, setRemoveFormData] = useState({ tanggal_selesai: "" });

  // State Modal History
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [houseHistory, setHouseHistory] = useState([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);

  // State Modal Hapus Rumah
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // --- FETCH DATA ---
  const fetchHouses = async () => {
    setIsLoading(true);
    try {
      const response = await api.get("/v1/houses", {
        params: {
          search: searchTerm,
          status_hunian: filterStatus === "semua" ? "" : filterStatus,
          per_page: 50,
        },
      });

      // NORMALISASI DATA (Mapping struktur API agar cocok dengan komponen React)
      const mappedHouses = response.data.data.map((house) => {
        // 1. Ekstrak data penghuni aktif dari array occupancy_histories
        let activeOccupancy = null;
        if (
          Array.isArray(house.occupancy_histories) &&
          house.occupancy_histories.length > 0
        ) {
          // Cari histori yang belum selesai (end_date = null)
          activeOccupancy =
            house.occupancy_histories.find(
              (h) => h.end_date === null || h.tanggal_selesai === null,
            ) || house.occupancy_histories[0];
        } else if (house.current_occupancy) {
          activeOccupancy = house.current_occupancy; // Fallback jika struktur lama
        }

        // 2. Normalisasi key data Resident
        let residentData = null;
        if (activeOccupancy && activeOccupancy.resident) {
          const r = activeOccupancy.resident;
          residentData = {
            ...r,
            nama_lengkap: r.name || r.nama_lengkap, // Mendukung key 'name' atau 'nama_lengkap'
            status_penghuni:
              r.is_permanent !== undefined
                ? r.is_permanent
                  ? "tetap"
                  : "kontrak"
                : r.status_penghuni,
          };
        }

        // 3. Kembalikan data rumah yang sudah distandardisasi
        return {
          ...house,
          id: house.id,
          block_number: house.block_number || house.nomor_blok_rumah,
          is_occupied:
            house.is_occupied !== undefined
              ? house.is_occupied
              : house.status_hunian === "dihuni"
                ? 1
                : 0,
          occupancy_histories: house.occupancy_histories,
          current_occupancy: activeOccupancy
            ? {
                ...activeOccupancy,
                resident: residentData,
              }
            : null,
        };
      });

      setHouses(mappedHouses);
    } catch (error) {
      console.error("Gagal mengambil data rumah:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Mengambil daftar warga untuk dropdown saat mengalokasikan penghuni
  const fetchResidentsDropdown = async () => {
    try {
      const response = await api.get("/v1/residents", {
        params: { per_page: 100 },
      });

      // Normalisasi dropdown juga agar bisa membaca 'name' dan 'is_permanent'
      const mappedResidents = response.data.data.map((r) => ({
        ...r,
        nama_lengkap: r.name || r.nama_lengkap,
        status_penghuni:
          r.is_permanent !== undefined
            ? r.is_permanent
              ? "tetap"
              : "kontrak"
            : r.status_penghuni,
      }));

      setResidentsList(mappedResidents);
    } catch (error) {
      console.error("Gagal mengambil data warga:", error);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchHouses();
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, filterStatus]);

  useEffect(() => {
    fetchResidentsDropdown();
  }, []);

  // --- HANDLERS: CRUD RUMAH ---
  const handleOpenAddHouse = () => {
    setHouseModalMode("add");
    setHouseFormData({
      id: null,
      block_number: "",
      is_occupied: "0",
    });
    setIsHouseFormOpen(true);
  };

  const handleOpenEditHouse = (house) => {
    setHouseModalMode("edit");
    setHouseFormData({
      id: house.id,
      block_number: house.block_number,
      is_occupied: house.is_occupied,
    });
    setIsHouseFormOpen(true);
  };

  const handleSaveHouse = async (e) => {
    e.preventDefault();
    try {
      // Siapkan payload dengan kedua jenis key untuk berjaga-jaga menyesuaikan Backend
      const payload = {
        ...houseFormData,
        block_number: houseFormData.block_number,
        is_occupied: houseFormData.is_occupied
          ? houseFormData.is_occupied === "1" || houseFormData.is_occupied === 1
            ? 1
            : 0
          : 0,
      };

      if (houseModalMode === "add") {
        await api.post("/v1/houses", payload);
      } else {
        await api.put(`/v1/houses/${houseFormData.id}`, payload);
      }
      setIsHouseFormOpen(false);
      fetchHouses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal menyimpan data rumah.");
    }
  };

  const handleDeleteHouse = async () => {
    try {
      await api.delete(`/v1/houses/${selectedHouse.id}`);
      setIsDeleteOpen(false);
      setSelectedHouse(null);
      fetchHouses();
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus rumah.");
    }
  };

  // --- HANDLERS: ALOKASI & PENGOSONGAN (ASSIGN / REMOVE) ---
  const handleOpenAssign = (house) => {
    setSelectedHouse(house);
    setAssignFormData({ resident_id: "", tanggal_mulai: "" });
    setIsAssignModalOpen(true);
  };

  const handleSaveAssign = async (e) => {
    e.preventDefault();
    try {
      // Coba tembak dengan key snake_case Inggris juga (start_date)
      const payload = {
        resident_id: assignFormData.resident_id,
        tanggal_mulai: assignFormData.tanggal_mulai,
        start_date: assignFormData.tanggal_mulai,
      };
      await api.post(`/v1/houses/${selectedHouse.id}/assign`, payload);
      setIsAssignModalOpen(false);
      fetchHouses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mengalokasikan penghuni.");
    }
  };

  const handleOpenRemove = (house) => {
    setSelectedHouse(house);
    setRemoveFormData({ tanggal_selesai: "" });
    setIsRemoveModalOpen(true);
  };

  const handleSaveRemove = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        tanggal_selesai: removeFormData.tanggal_selesai,
        end_date: removeFormData.tanggal_selesai,
      };
      await api.post(`/v1/houses/${selectedHouse.id}/remove`, payload);
      setIsRemoveModalOpen(false);
      fetchHouses();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mengosongkan rumah.");
    }
  };

  // --- HANDLERS: HISTORI HUNIAN ---
  const handleViewHistory = async (house) => {
    setSelectedHouse(house);
    setIsHistoryModalOpen(true);
    setIsHistoryLoading(true);
    try {
      const response = await api.get(`/v1/houses/${house.id}/history`);
      // Normalisasi histori agar sesuai di UI
      const mappedHistory = response.data.data.map((hist) => ({
        ...hist,
        tanggal_mulai: hist.start_date || hist.tanggal_mulai,
        tanggal_selesai: hist.end_date || hist.tanggal_selesai,
        resident: hist.resident
          ? {
              ...hist.resident,
              nama_lengkap: hist.resident.name || hist.resident.nama_lengkap,
            }
          : null,
      }));
      setHouseHistory(mappedHistory);
    } catch (error) {
      console.error("Gagal mengambil histori:", error);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header & Button Tambah */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Manajemen Rumah</h2>
          <p className="text-gray-500 text-sm mt-1">
            Kelola data perumahan dan alokasi hunian warga
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
            placeholder="Cari nomor blok..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <div className="flex items-center space-x-2">
          <Filter className="text-gray-400 w-5 h-5" />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
          >
            <option value="semua">Semua Status</option>
            <option value="dihuni">Dihuni</option>
            <option value="tidak_dihuni">Kosong</option>
          </select>
        </div>
      </div>

      {/* Loading State Overlay (Untuk Grid) */}
      <div className="relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-slate-50/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* GRID CARDS RUMAH */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {houses.length > 0
            ? houses.map((house) => (
                <div
                  key={house.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex flex-col relative group hover:shadow-md transition-all duration-200"
                >
                  {/* Dropdown Aksi (Pojok Kanan Atas) */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex bg-white shadow-sm border border-gray-100 rounded-lg overflow-hidden">
                      <button
                        onClick={() => handleOpenEditHouse(house)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 transition"
                        title="Edit Blok"
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
                      className={`p-4 rounded-full mb-3 ${house.is_occupied === 1 || house.is_occupied === "1" ? "bg-emerald-50 text-emerald-500" : "bg-slate-50 text-slate-300"}`}
                    >
                      <Home className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-gray-800 text-lg">
                      {house.block_number}
                    </h3>
                    <span
                      className={`mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider ${
                        house.is_occupied === 1 || house.is_occupied === "1"
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {house.is_occupied === 1 || house.is_occupied === "1"
                        ? "Dihuni"
                        : "Kosong"}
                    </span>
                  </div>

                  {/* Info Penghuni Aktif */}
                  <div className="bg-gray-50 rounded-xl p-3 mb-4 flex-1 border border-gray-100 text-center flex flex-col justify-center">
                    {house.current_occupant?.resident ? (
                      <>
                        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-1">
                          Dihuni Oleh
                        </p>
                        <p
                          className="font-semibold text-gray-800 text-sm line-clamp-1"
                          title={house.current_occupant.resident.name}
                        >
                          {house.current_occupant.resident.name}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5 capitalize">
                          {house.current_occupant.resident.is_permanent !==
                          undefined
                            ? house.current_occupant.resident.is_permanent
                              ? "Penghuni Tetap"
                              : "Penghuni Kontrak"
                            : house.current_occupant.resident.status_penghuni}
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
                    {house.is_occupied === 1 || house.is_occupied === "1" ? (
                      <button
                        onClick={() => handleOpenRemove(house)}
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
                      onClick={() => handleViewHistory(house)}
                      className="flex items-center justify-center space-x-1 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition text-xs font-semibold"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>Histori</span>
                    </button>
                  </div>
                </div>
              ))
            : !isLoading && (
                <div className="col-span-full py-12 text-center text-gray-500 bg-white rounded-xl border border-gray-100 border-dashed">
                  Data rumah tidak ditemukan.
                </div>
              )}
        </div>
      </div>

      {/* =========================================
          MODALS
      ========================================= */}

      {/* 1. Modal Form Tambah/Edit Rumah */}
      <Modal
        isOpen={isHouseFormOpen}
        onClose={() => setIsHouseFormOpen(false)}
        title={houseModalMode === "add" ? "Tambah Rumah" : "Edit Rumah"}
      >
        <form onSubmit={handleSaveHouse} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nomor Blok Rumah
            </label>
            <input
              type="text"
              required
              value={houseFormData.block_number}
              onChange={(e) =>
                setHouseFormData({
                  ...houseFormData,
                  block_number: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition"
              placeholder="Contoh: Blok A-01"
            />
          </div>
          {houseModalMode === "add" && (
            <p className="text-xs text-gray-500 bg-blue-50 p-3 rounded-lg border border-blue-100">
              ℹ️ Rumah baru yang ditambahkan otomatis berstatus "Kosong". Anda
              bisa mengisi penghuninya lewat menu "Isi Rumah".
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
        title="Isi Rumah Baru"
      >
        <form onSubmit={handleSaveAssign} className="p-6 space-y-5">
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center space-x-4 mb-2">
            <div className="p-2 bg-white rounded-lg border border-slate-200">
              <Home className="w-6 h-6 text-slate-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Target Rumah</p>
              <p className="text-lg font-bold text-gray-800">
                {selectedHouse?.block_number}
              </p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Penghuni
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            >
              <option value="" disabled>
                -- Pilih warga terdaftar --
              </option>
              {residentsList.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.nama_lengkap} ({r.status_penghuni})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mulai Menempati
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
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
              Konfirmasi
            </button>
          </div>
        </form>
      </Modal>

      {/* 3. Modal Kosongkan Rumah (Remove Resident) */}
      <Modal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        title="Kosongkan Rumah"
      >
        <form onSubmit={handleSaveRemove} className="p-6 space-y-4">
          <p className="text-sm text-gray-600 mb-2">
            Tentukan tanggal warga keluar dari rumah{" "}
            <strong>{selectedHouse?.block_number}</strong>.
          </p>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tanggal Keluar
            </label>
            <input
              type="date"
              required
              value={removeFormData.tanggal_selesai}
              onChange={(e) =>
                setRemoveFormData({ tanggal_selesai: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsRemoveModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-amber-600 hover:bg-amber-700 rounded-lg transition font-medium"
            >
              Kosongkan
            </button>
          </div>
        </form>
      </Modal>

      {/* 4. Modal Histori Hunian */}
      <Modal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        title={`Histori Penghuni: ${selectedHouse?.block_number}`}
      >
        <div className="p-6 max-h-96 overflow-y-auto">
          {isHistoryLoading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : houseHistory.length > 0 ? (
            <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
              {houseHistory.map((hist, idx) => (
                <div
                  key={idx}
                  className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
                >
                  {/* Timeline Dot */}
                  <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-blue-500 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                    <UserPlus className="w-4 h-4 text-white" />
                  </div>
                  {/* Content Card */}
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-slate-900">
                        {hist.resident?.nama_lengkap}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mb-2">
                      {hist.tanggal_mulai} s/d{" "}
                      {hist.tanggal_selesai || "Sekarang"}
                    </p>
                    <span
                      className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest ${!hist.tanggal_selesai ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"}`}
                    >
                      {!hist.tanggal_selesai ? "Penghuni Aktif" : "Pindah"}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">
              Belum ada riwayat penghuni untuk rumah ini.
            </p>
          )}
        </div>
      </Modal>

      {/* 5. Modal Konfirmasi Hapus */}
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
            Yakin ingin menghapus rumah{" "}
            <strong>{selectedHouse?.block_number}</strong>? Aksi ini juga
            menghapus riwayatnya.
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
              Hapus
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
