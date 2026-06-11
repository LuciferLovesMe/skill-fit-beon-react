import React, { useState, useEffect } from "react";
import {
  DollarSign,
  Plus,
  ArrowDownToLine,
  ArrowUpFromLine,
  Search,
  Filter,
  CheckCircle,
  X,
  Loader2,
  Clock,
} from "lucide-react";
import Modal from "../components/Modal";
import api from "../api/api";
import Table from "../components/Table";

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState("pemasukan");

  const [payments, setPayments] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [housesList, setHousesList] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // State Pagination Terpisah
  const [paymentPage, setPaymentPage] = useState(1);
  const [paymentMeta, setPaymentMeta] = useState(null);
  const [expensePage, setExpensePage] = useState(1);
  const [expenseMeta, setExpenseMeta] = useState(null);

  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);

  // Form State Pemasukan/Iuran
  const initialPaymentForm = {
    house_id: "",
    fee_type: "cleaning",
    duration_months: 1,
    start_month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  };
  const [paymentFormData, setPaymentFormData] = useState(initialPaymentForm);

  // Form State Pengeluaran Kas
  const initialExpenseForm = {
    description: "",
    amount: "",
    expense_date: new Date().toISOString().split("T")[0],
  };
  const [expenseFormData, setExpenseFormData] = useState(initialExpenseForm);

  const monthNames = [
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

  // --- FETCH DATA ---
  const fetchPayments = async (
    searchQuery = searchTerm,
    page = paymentPage,
  ) => {
    setIsLoading(true);
    try {
      const response = await api.get("/v1/payments", {
        params: { search: searchQuery, page: page, per_page: 10 },
      });
      setPayments(response.data.data);
      setPaymentMeta(response.data.meta);
    } catch (error) {
      console.error("Gagal mengambil data pemasukan:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchExpenses = async (
    searchQuery = searchTerm,
    page = expensePage,
  ) => {
    setIsLoading(true);
    try {
      const response = await api.get("/v1/expenses", {
        params: { search: searchQuery, page: page, per_page: 10 },
      });
      setExpenses(response.data.data);
      setExpenseMeta(response.data.meta);
    } catch (error) {
      console.error("Gagal mengambil data pengeluaran:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHousesForDropdown = async () => {
    try {
      const response = await api.get("/v1/houses", {
        params: { status_hunian: "dihuni", per_page: 100 },
      });
      setHousesList(response.data.data);
    } catch (error) {
      console.error("Gagal mengambil data rumah:", error);
    }
  };

  // Efek Search (Reset ke page 1)
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (activeTab === "pemasukan") {
        setPaymentPage(1);
        fetchPayments(searchTerm, 1);
      } else {
        setExpensePage(1);
        fetchExpenses(searchTerm, 1);
      }
    }, 500);
    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, activeTab]);

  useEffect(() => {
    fetchHousesForDropdown();
  }, []);

  // Handlers Pagination
  const handlePaymentPageChange = (newPage) => {
    setPaymentPage(newPage);
    fetchPayments(searchTerm, newPage);
  };

  const handleExpensePageChange = (newPage) => {
    setExpensePage(newPage);
    fetchExpenses(searchTerm, newPage);
  };

  // --- HANDLERS FORMS ---
  const handleSavePayment = async (e) => {
    e.preventDefault();

    const selectedHouseObj = housesList.find(
      (h) => h.id.toString() === paymentFormData.house_id.toString(),
    );
    const residentId = selectedHouseObj?.current_occupant?.resident?.id;

    if (!residentId) {
      alert(
        "Error: Rumah yang dipilih tidak memiliki data penghuni (warga) yang aktif.",
      );
      return;
    }

    const baseAmount = paymentFormData.fee_type === "security" ? 100000 : 15000;

    // PASTIKAN DATA ANGKA MURNI INTEGER (parseInt)
    const payload = {
      house_id: parseInt(paymentFormData.house_id),
      resident_id: parseInt(residentId),
      fee_type: paymentFormData.fee_type,
      start_month: parseInt(paymentFormData.start_month), // <- Ini sebelumnya menyebabkan error di backend
      year: parseInt(paymentFormData.year), // <- Ini juga
      billed_amount: baseAmount,
      paid_amount: baseAmount,
      payment_date: new Date().toISOString().split("T")[0],
      is_paid: 1,
      duration_months: parseInt(paymentFormData.duration_months), // <- SANGAT PENTING: Ubah "1" jadi 1
    };

    try {
      await api.post("/v1/payments/pay", payload);
      setIsPaymentModalOpen(false);
      setPaymentFormData(initialPaymentForm);
      fetchPayments(searchTerm, paymentPage);
      alert("Pembayaran berhasil dicatat.");
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal mencatat pembayaran.");
    }
  };

  const handleSaveExpense = async (e) => {
    e.preventDefault();
    try {
      await api.post("/v1/expenses", expenseFormData);
      setIsExpenseModalOpen(false);
      setExpenseFormData(initialExpenseForm);
      fetchExpenses(searchTerm, expensePage);
      alert("Pengeluaran berhasil dicatat.");
    } catch (error) {
      alert(error.response?.data?.message || "Gagal mencatat pengeluaran.");
    }
  };

  const colPemasukan = [
    {
      label: "Rumah & Penghuni",
      render: (r) => (
        <div>
          <p className="font-bold text-gray-800">{r.house?.block_number}</p>
          <p className="text-xs text-gray-500">
            {r.resident?.name || "Penghuni Tidak Diketahui"}
          </p>
        </div>
      ),
    },
    {
      label: "Jenis Iuran",
      render: (r) => (
        <span
          className={`px-2.5 py-1 rounded-md text-xs font-semibold uppercase tracking-wider ${r.fee_type === "security" ? "bg-indigo-100 text-indigo-700" : "bg-teal-100 text-teal-700"}`}
        >
          {r.fee_type === "security" ? "Satpam" : "Kebersihan"}
        </span>
      ),
    },
    { label: "Periode", render: (r) => `${monthNames[r.month - 1]} ${r.year}` },
    {
      label: "Nominal Dibayar",
      render: (r) => (
        <span className="font-medium text-gray-800">
          Rp{" "}
          {parseInt(r.paid_amount || r.billed_amount).toLocaleString("id-ID")}
        </span>
      ),
    },
    { label: "Tgl Bayar", render: (r) => r.payment_date || "-" },
    {
      label: "Status",
      render: (r) =>
        r.is_paid == 1 ? (
          <span className="flex items-center text-emerald-600 text-xs font-bold">
            <CheckCircle className="w-4 h-4 mr-1" /> LUNAS
          </span>
        ) : (
          <span className="flex items-center text-amber-600 text-xs font-bold">
            <Clock className="w-4 h-4 mr-1" /> PENDING
          </span>
        ),
    },
  ];

  const colPengeluaran = [
    {
      label: "Tanggal Pengeluaran",
      render: (r) => (
        <span className="font-medium text-gray-600">{r.expense_date}</span>
      ),
      headerClassName: "w-48",
    },
    {
      label: "Keterangan / Deskripsi",
      render: (r) => (
        <span className="font-bold text-gray-800">{r.description}</span>
      ),
    },
    {
      label: "Nominal",
      render: (r) => (
        <span className="font-bold text-rose-600">
          Rp {parseInt(r.amount).toLocaleString("id-ID")}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Keuangan & Iuran</h2>
          <p className="text-gray-500 text-sm mt-1">
            Catat transaksi pemasukan iuran warga dan pengeluaran kas RT
          </p>
        </div>
        <div className="flex space-x-3 shrink-0">
          <button
            onClick={() => setIsPaymentModalOpen(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Terima Iuran</span>
          </button>
          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="bg-rose-600 hover:bg-rose-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition shadow-sm"
          >
            <ArrowUpFromLine className="w-4 h-4" />
            <span>Catat Pengeluaran</span>
          </button>
        </div>
      </div>

      <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-100 inline-flex">
        <button
          onClick={() => {
            setActiveTab("pemasukan");
            setSearchTerm("");
          }}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "pemasukan" ? "bg-blue-50 text-blue-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          Pemasukan (Iuran)
        </button>
        <button
          onClick={() => {
            setActiveTab("pengeluaran");
            setSearchTerm("");
          }}
          className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${activeTab === "pengeluaran" ? "bg-rose-50 text-rose-700 shadow-sm" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`}
        >
          Pengeluaran Kas
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder={
              activeTab === "pemasukan"
                ? "Cari blok rumah..."
                : "Cari keterangan pengeluaran..."
            }
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
          />
        </div>
      </div>

      <div className="relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 z-10 bg-white/50 backdrop-blur-sm flex items-center justify-center rounded-xl">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          </div>
        )}
        {activeTab === "pemasukan" ? (
          <Table
            columns={colPemasukan}
            data={payments}
            emptyMessage="Belum ada data pemasukan."
            meta={paymentMeta}
            onPageChange={handlePaymentPageChange}
          />
        ) : (
          <Table
            columns={colPengeluaran}
            data={expenses}
            emptyMessage="Belum ada data pengeluaran."
            meta={expenseMeta}
            onPageChange={handleExpensePageChange}
          />
        )}
      </div>

      {/* --- FORM MODALS --- */}
      <Modal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
        title="Penerimaan Iuran Baru"
      >
        <form className="p-6 space-y-4" onSubmit={handleSavePayment}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Pilih Rumah & Penghuni Aktif
            </label>
            <select
              required
              value={paymentFormData.house_id}
              onChange={(e) =>
                setPaymentFormData({
                  ...paymentFormData,
                  house_id: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Pilih Rumah --
              </option>
              {housesList.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.block_number} - (
                  {h.current_occupant?.resident?.name || "Kosong"})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Jenis Iuran
              </label>
              <select
                required
                value={paymentFormData.fee_type}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    fee_type: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                <option value="cleaning">Kebersihan (Rp 15.000 / bln)</option>
                <option value="security">Satpam (Rp 100.000 / bln)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Durasi Bayar (Bulan)
              </label>
              <input
                type="number"
                min="1"
                max="12"
                value={paymentFormData.duration_months}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    duration_months: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mulai Bulan ke-
              </label>
              <select
                required
                name="start_month"
                value={paymentFormData.start_month}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    start_month: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none bg-white focus:ring-2 focus:ring-blue-500"
              >
                {monthNames.map((nama, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1} - {nama}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun
              </label>
              <input
                type="number"
                min="2020"
                max="2100"
                value={paymentFormData.year}
                onChange={(e) =>
                  setPaymentFormData({
                    ...paymentFormData,
                    year: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 mt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-600">
                Estimasi Total Tagihan:
              </span>
              <span className="text-lg font-bold text-emerald-600">
                Rp{" "}
                {(
                  (paymentFormData.fee_type === "security" ? 100000 : 15000) *
                  paymentFormData.duration_months
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsPaymentModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg font-medium transition"
            >
              Proses Pembayaran
            </button>
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isExpenseModalOpen}
        onClose={() => setIsExpenseModalOpen(false)}
        title="Catat Pengeluaran Kas"
      >
        <form className="p-6 space-y-4" onSubmit={handleSaveExpense}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Keterangan / Deskripsi
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: Beli lampu jalan Blok A"
              value={expenseFormData.description}
              onChange={(e) =>
                setExpenseFormData({
                  ...expenseFormData,
                  description: e.target.value,
                })
              }
              className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
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
                min="1"
                value={expenseFormData.amount}
                onChange={(e) =>
                  setExpenseFormData({
                    ...expenseFormData,
                    amount: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tanggal
              </label>
              <input
                type="date"
                required
                value={expenseFormData.expense_date}
                onChange={(e) =>
                  setExpenseFormData({
                    ...expenseFormData,
                    expense_date: e.target.value,
                  })
                }
                className="w-full px-4 py-2 border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="pt-4 flex justify-end space-x-3 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => setIsExpenseModalOpen(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-rose-600 hover:bg-rose-700 rounded-lg font-medium transition"
            >
              Simpan Pengeluaran
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
