import React, { useState } from "react";
import {
  DollarSign,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Filter,
  CheckCircle,
  X,
} from "lucide-react";
import Table from "../components/Table"; // Import komponen tabel yang baru dibuat
import Modal from "../components/Modal";

const mockPemasukan = [
  {
    id: 1,
    rumah: "Blok A-01",
    penghuni: "Budi Santoso",
    jenis: "kebersihan",
    bulan: 6,
    tahun: 2026,
    nominal: 15000,
    tgl_bayar: "2026-06-01",
  },
  {
    id: 2,
    rumah: "Blok A-01",
    penghuni: "Budi Santoso",
    jenis: "satpam",
    bulan: 6,
    tahun: 2026,
    nominal: 100000,
    tgl_bayar: "2026-06-01",
  },
  {
    id: 3,
    rumah: "Blok A-02",
    penghuni: "Siti Aminah",
    jenis: "kebersihan",
    bulan: 6,
    tahun: 2026,
    nominal: 15000,
    tgl_bayar: "2026-06-05",
  },
];

const mockPengeluaran = [
  {
    id: 1,
    keterangan: "Gaji Satpam Bulan Juni",
    nominal: 2500000,
    tanggal: "2026-06-02",
  },
  {
    id: 2,
    keterangan: "Perbaikan Selokan Blok A",
    nominal: 850000,
    tanggal: "2026-06-10",
  },
  {
    id: 3,
    keterangan: "Token Listrik Pos Satpam",
    nominal: 200000,
    tanggal: "2026-06-15",
  },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("pemasukan"); // 'pemasukan' | 'pengeluaran'

  // Data State
  const [pemasukan, setPemasukan] = useState(mockPemasukan);
  const [pengeluaran, setPengeluaran] = useState(mockPengeluaran);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal State
  const [isPemasukanModalOpen, setIsPemasukanModalOpen] = useState(false);
  const [isPengeluaranModalOpen, setIsPengeluaranModalOpen] = useState(false);

  const namaBulan = [
    "Januari",
    "Februari",
    "Maret",
    "April",
    "Mei",
    "Juni",
    "Juli",
    "Agustus",
    "September",
    "Oktober",
    "November",
    "Desember",
  ];

  // Column Configurations
  const colPemasukan = [
    {
      label: "Rumah & Penghuni",
      render: (r) => (
        <div>
          <p className="font-bold text-gray-800">{r.rumah}</p>
          <p className="text-xs text-gray-500">{r.penghuni}</p>
        </div>
      ),
    },
    {
      label: "Jenis Iuran",
      render: (r) => (
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${r.jenis === "satpam" ? "bg-indigo-100 text-indigo-700" : "bg-teal-100 text-teal-700"}`}
        >
          {r.jenis}
        </span>
      ),
    },
    { label: "Periode", render: (r) => `${namaBulan[r.bulan - 1]} ${r.tahun}` },
    {
      label: "Nominal",
      render: (r) => (
        <span className="font-medium text-gray-800">
          Rp {r.nominal.toLocaleString("id-ID")}
        </span>
      ),
    },
    { label: "Tgl Bayar", accessor: "tgl_bayar" },
    {
      label: "Status",
      render: () => (
        <span className="flex items-center text-emerald-600 text-xs font-bold">
          <CheckCircle className="w-4 h-4 mr-1" /> LUNAS
        </span>
      ),
    },
  ];

  const colPengeluaran = [
    { label: "Tanggal", accessor: "tanggal", headerClassName: "w-40" },
    {
      label: "Keterangan Pengeluaran",
      render: (r) => (
        <span className="font-medium text-gray-800">{r.keterangan}</span>
      ),
    },
    {
      label: "Nominal",
      render: (r) => (
        <span className="font-bold text-rose-600">
          Rp {r.nominal.toLocaleString("id-ID")}
        </span>
      ),
    },
  ];

  // Filters
  const filteredPemasukan = pemasukan.filter(
    (p) =>
      p.rumah.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.penghuni.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredPengeluaran = pengeluaran.filter((p) =>
    p.keterangan.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Keuangan & Iuran</h2>
          <p className="text-gray-500 text-sm mt-1">
            Catat transaksi pemasukan iuran dan pengeluaran kas RT
          </p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <button
            onClick={() => setIsPemasukanModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Terima Iuran</span>
          </button>
          <button
            onClick={() => setIsPengeluaranModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
        <button
          onClick={() => setActiveTab("pemasukan")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "pemasukan" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          Pemasukan (Iuran Warga)
        </button>
        <button
          onClick={() => setActiveTab("pengeluaran")}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "pengeluaran" ? "bg-rose-50 text-rose-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          Pengeluaran Kas
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={
              activeTab === "pemasukan"
                ? "Cari rumah atau nama warga..."
                : "Cari keterangan pengeluaran..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
        <button className="px-4 py-2 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center space-x-2 transition shrink-0">
          <Filter className="w-4 h-4" />
          <span>Filter Bulan</span>
        </button>
      </div>

      {/* Tables */}
      {activeTab === "pemasukan" ? (
        <Table
          columns={colPemasukan}
          data={filteredPemasukan}
          emptyMessage="Belum ada data pemasukan."
        />
      ) : (
        <Table
          columns={colPengeluaran}
          data={filteredPengeluaran}
          emptyMessage="Belum ada data pengeluaran."
        />
      )}

      {/* MODAL: Pemasukan */}
      <Modal
        isOpen={isPemasukanModalOpen}
        onClose={() => setIsPemasukanModalOpen(false)}
        title="Penerimaan Iuran Baru"
      >
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsPemasukanModalOpen(false);
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Rumah & Penghuni
            </label>
            <select
              required
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
            >
              <option value="">-- Pilih Rumah --</option>
              <option value="1">Blok A-01 (Budi Santoso)</option>
              <option value="2">Blok A-02 (Siti Aminah)</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Iuran
              </label>
              <select
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white"
              >
                <option value="kebersihan">Kebersihan (Rp 15.000)</option>
                <option value="satpam">Satpam (Rp 100.000)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi (Bulan)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                defaultValue="1"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">*Satpam max 1 bulan</p>
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsPemasukanModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium"
            >
              Proses Pembayaran
            </button>
          </div>
        </form>
      </Modal>

      {/* MODAL: Pengeluaran */}
      <Modal
        isOpen={isPengeluaranModalOpen}
        onClose={() => setIsPengeluaranModalOpen(false)}
        title="Catat Pengeluaran Kas"
      >
        <form
          className="p-6 space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            setIsPengeluaranModalOpen(false);
          }}
        >
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan Pengeluaran
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Beli lampu jalan"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nominal (Rp)
              </label>
              <input
                type="number"
                required
                placeholder="50000"
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                required
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsPengeluaranModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-medium"
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
