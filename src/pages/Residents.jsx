import React, { useState, useEffect } from "react";
import {
  Users,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  X,
  Upload,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import Table from "../components/Table"; // Import komponen tabel yang baru dibuat
import Modal from "../components/Modal";
import api from "../api/api"; // Import API client (jika sudah dibuat)

const STORAGE_URL = "http://localhost:8000/storage/";

export default function ResidentsPage() {
  const [residents, setResidents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // State Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState(null);

  // State Modal Form (Menggunakan variabel bahasa Inggris)
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const initialFormState = {
    id: null,
    name: "",
    is_permanent: 1,
    phone_number: "",
    is_married: 0,
    id_card_photo: null,
  };
  const [formData, setFormData] = useState(initialFormState);

  // State Modal Hapus
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [residentToDelete, setResidentToDelete] = useState(null);

  // --- FETCH DATA ---
  const fetchResidents = async (searchQuery = "", page = 1) => {
    setIsLoading(true);
    try {
      const response = await api.get("/v1/residents", {
        params: {
          search: searchQuery,
          per_page: 10,
          page: page,
        },
      });
      setResidents(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error("Gagal mengambil data penghuni:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setCurrentPage(1);
    const delayDebounceFn = setTimeout(() => {
      fetchResidents(searchTerm, 1);
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchResidents(searchTerm, newPage);
  };

  // --- HANDLERS ---
  const handleOpenAdd = () => {
    setModalMode("add");
    setFormData(initialFormState);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (resident) => {
    setModalMode("edit");
    setFormData({
      id: resident.id,
      name: resident.name,
      is_permanent: resident.is_permanent,
      phone_number: resident.phone_number,
      is_married: resident.is_married,
      id_card_photo: resident.id_card_photo,
    });
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setFormData(initialFormState);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Parsing boolean/integer untuk radio dan select
    let parsedValue = value;
    if (value === "1") parsedValue = 1;
    if (value === "0") parsedValue = 0;

    setFormData({ ...formData, [name]: parsedValue });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, id_card_photo: e.target.files[0] });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const submitData = new FormData();
    submitData.append("name", formData.name);
    submitData.append("is_permanent", formData.is_permanent);
    submitData.append("phone_number", formData.phone_number);
    submitData.append("is_married", formData.is_married);

    if (formData.id_card_photo instanceof File) {
      submitData.append("id_card_photo", formData.id_card_photo);
    }

    try {
      if (modalMode === "add") {
        await api.post("/v1/residents", submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        submitData.append("_method", "PUT");
        await api.post(`/v1/residents/${formData.id}`, submitData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }
      handleCloseForm();
      fetchResidents(searchTerm, currentPage);
    } catch (error) {
      console.error(error);
      alert("Gagal menyimpan data.");
    }
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/v1/residents/${residentToDelete.id}`);
      setIsDeleteOpen(false);
      setResidentToDelete(null);
      setCurrentPage(1);
      fetchResidents(searchTerm, 1);
    } catch (error) {
      console.error(error);
      alert("Gagal menghapus data warga.");
    }
  };

  const getPreviewUrl = () => {
    if (!formData.id_card_photo) return null;
    if (formData.id_card_photo instanceof File)
      return URL.createObjectURL(formData.id_card_photo);
    return `${STORAGE_URL}${formData.id_card_photo}`;
  };

  const tableColumns = [
    {
      label: "Nama Lengkap",
      render: (r) => (
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold overflow-hidden shrink-0 border border-slate-300">
            {r.id_card_photo ? (
              <img
                src={`${STORAGE_URL}${r.id_card_photo}`}
                alt="KTP"
                className="w-full h-full object-cover"
              />
            ) : (
              r.name.charAt(0).toUpperCase()
            )}
          </div>
          <span className="font-medium text-gray-800">{r.name}</span>
        </div>
      ),
    },
    {
      label: "Status Hunian",
      render: (r) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            r.is_permanent === 1
              ? "bg-emerald-100 text-emerald-700"
              : "bg-amber-100 text-amber-700"
          }`}
        >
          {r.is_permanent === 1 ? "TETAP" : "KONTRAK"}
        </span>
      ),
    },
    { label: "No. Telepon", accessor: "phone_number" },
    {
      label: "Status Menikah",
      render: (r) => (r.is_married === 1 ? "Menikah" : "Belum Menikah"),
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
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

      <div className="relative">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl border border-transparent">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}

        {/* Pass parameter meta & onPageChange ke komponen Table */}
        <Table
          columns={tableColumns}
          data={residents}
          emptyMessage={
            isLoading ? "Memuat data..." : "Data penghuni tidak ditemukan."
          }
          meta={meta}
          onPageChange={handlePageChange}
        />
      </div>

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
              name="name"
              required
              value={formData.name}
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
                name="phone_number"
                required
                value={formData.phone_number}
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
                name="is_married"
                value={formData.is_married}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition bg-white"
              >
                <option value={0}>Belum Menikah</option>
                <option value={1}>Sudah Menikah</option>
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
                  name="is_permanent"
                  value="1"
                  checked={formData.is_permanent === 1}
                  onChange={handleChange}
                  className="text-blue-600 focus:ring-blue-500"
                />
                <span className="text-gray-700 text-sm">Penghuni Tetap</span>
              </label>
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="radio"
                  name="is_permanent"
                  value="0"
                  checked={formData.is_permanent === 0}
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
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition relative overflow-hidden group">
              {getPreviewUrl() && (
                <div className="absolute inset-0 w-full h-full opacity-30 group-hover:opacity-10 transition-opacity">
                  <img
                    src={getPreviewUrl()}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              <div className="space-y-1 text-center relative z-10">
                {getPreviewUrl() ? (
                  <img
                    src={getPreviewUrl()}
                    alt="KTP Preview"
                    className="mx-auto h-24 rounded-lg object-contain border border-gray-200 shadow-sm"
                  />
                ) : (
                  <ImageIcon className="mx-auto h-10 w-10 text-gray-400" />
                )}
                <div className="flex text-sm text-gray-600 justify-center mt-3">
                  <label className="relative cursor-pointer bg-white px-3 py-1 border border-gray-200 rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none shadow-sm">
                    <span>
                      {getPreviewUrl() ? "Ganti Foto" : "Upload file KTP"}
                    </span>
                    <input
                      type="file"
                      className="sr-only"
                      accept="image/jpeg,image/png,image/jpg"
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
                <p className="text-xs text-gray-500 mt-2">PNG, JPG up to 2MB</p>
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
              {modalMode === "add" ? "Simpan Data" : "Simpan Perubahan"}
            </button>
          </div>
        </form>
      </Modal>

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
            Yakin ingin menghapus data <strong>{residentToDelete?.name}</strong>
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
