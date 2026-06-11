import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Home,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
  Loader2,
} from "lucide-react";
import api from "../api/api";

export default function DashboardPage() {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  // Data State
  const [chartData, setChartData] = useState([]);
  const [summaryStats, setSummaryStats] = useState({
    totalIncome: 0,
    totalExpense: 0,
    currentBalance: 0,
  });
  const [houseStats, setHouseStats] = useState({ occupied: 0, vacant: 0 });
  const [residentCount, setResidentCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // Fungsi memformat singkatan bulan agar muat di Chart (ex: "Januari" -> "Jan")
  const formatMonth = (fullMonthName) => {
    return fullMonthName ? fullMonthName.substring(0, 3) : "";
  };

  // --- FETCH DATA DASHBOARD ---
  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      // 1. Ambil Laporan Keuangan Tahunan
      const reportRes = await api.get("/v1/reports/yearly", {
        params: { year: selectedYear },
      });
      const rawChartData = reportRes.data.data;

      // Format data untuk Chart
      const formattedChartData = rawChartData.map((item) => ({
        ...item,
        month_short: formatMonth(item.monthName),
        income: parseInt(item.income || 0),
        outcome: parseInt(item.outcome || 0),
        balance: parseInt(item.balance || 0),
      }));
      setChartData(formattedChartData);

      // Kalkulasi Ringkasan Keuangan (Total setahun)
      const totalInc = rawChartData.reduce(
        (acc, curr) => acc + parseInt(curr.income || 0),
        0,
      );
      const totalExp = rawChartData.reduce(
        (acc, curr) => acc + parseInt(curr.outcome || 0),
        0,
      );
      // Saldo akhir adalah balance di bulan ke-12 (Desember)
      const finalBalance = rawChartData[11]?.balance || 0;

      setSummaryStats({
        totalIncome: totalInc,
        totalExpense: totalExp,
        currentBalance: finalBalance,
      });

      // 2. Ambil Statistik Rumah & Penghuni
      const housesRes = await api.get("/v1/houses", {
        params: { per_page: 100 },
      });
      const residentsRes = await api.get("/v1/residents", {
        params: { per_page: 100 },
      });

      const houses = housesRes.data.data;
      const occupiedCount = houses.filter(
        (h) => h.is_occupied === 1 || h.occupancy_status === "occupied",
      ).length;

      setHouseStats({
        occupied: occupiedCount,
        vacant: houses.length - occupiedCount,
      });
      setResidentCount(residentsRes.data.data.length);
    } catch (error) {
      console.error("Gagal mengambil data dashboard:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Trigger ulang jika tahun diganti
  useEffect(() => {
    fetchDashboardData();
  }, [selectedYear]);

  // Komponen Helper untuk Card Statistik di atas
  const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
    <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center">
          <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
        </div>
      )}

      <div
        className={`w-14 h-14 ${colorClass} rounded-2xl flex items-center justify-center text-white shrink-0`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subtitle && <p className="text-xs text-gray-400 mt-1">{subtitle}</p>}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Statistik
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan kondisi hunian dan keuangan RT terpadu
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-gray-100">
          <span className="text-sm text-gray-500 font-medium">Tahun:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            disabled={isLoading}
            className="bg-transparent text-gray-800 font-bold outline-none cursor-pointer"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
            <option value="2024">2024</option>
          </select>
        </div>
      </div>

      {/* TOP STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Kas RT (Berjalan)"
          value={`Rp ${summaryStats.currentBalance.toLocaleString("id-ID")}`}
          icon={Wallet}
          colorClass="bg-blue-600"
          subtitle="Akumulasi sisa kas bersih"
        />
        <StatCard
          title={`Total Pemasukan (${selectedYear})`}
          value={`Rp ${summaryStats.totalIncome.toLocaleString("id-ID")}`}
          icon={TrendingUp}
          colorClass="bg-emerald-500"
        />
        <StatCard
          title={`Total Pengeluaran (${selectedYear})`}
          value={`Rp ${summaryStats.totalExpense.toLocaleString("id-ID")}`}
          icon={TrendingDown}
          colorClass="bg-rose-500"
        />
        <div className="flex flex-col gap-4 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-xl">
              <Loader2 className="w-5 h-5 text-gray-400 animate-spin" />
            </div>
          )}
          {/* Card Mini status hunian */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Rumah Dihuni / Kosong
              </p>
              <p className="font-bold text-gray-800">
                {houseStats.occupied}{" "}
                <span className="text-gray-300 mx-1">/</span>{" "}
                {houseStats.vacant}
              </p>
            </div>
          </div>
          {/* Card Mini status warga */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Total Warga Terdaftar
              </p>
              <p className="font-bold text-gray-800">{residentCount} Orang</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: Pemasukan vs Pengeluaran (Bar Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Arus Kas Bulanan
            </h3>
            <p className="text-sm text-gray-500">
              Perbandingan uang masuk (iuran) dan keluar di tahun {selectedYear}
            </p>
          </div>
          <div className="w-full h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="month_short"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  tickFormatter={(val) => `Rp ${val / 1000}k`}
                />
                <Tooltip
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "8px",
                  }}
                  formatter={(value) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    undefined,
                  ]}
                />
                <Legend
                  iconType="circle"
                  wrapperStyle={{ paddingTop: "20px" }}
                />
                <Bar
                  dataKey="income"
                  name="Pemasukan"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="outcome"
                  name="Pengeluaran"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Saldo Kumulatif (Line Chart) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative">
          {isLoading && (
            <div className="absolute inset-0 bg-white/70 backdrop-blur-sm z-10 flex items-center justify-center rounded-2xl">
              <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
            </div>
          )}
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Pertumbuhan Saldo RT
            </h3>
            <p className="text-sm text-gray-500">Akumulasi sisa kas berjalan</p>
          </div>
          <div className="w-full h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="month_short"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#6b7280" }}
                  dy={10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{
                    fontWeight: "bold",
                    color: "#1f2937",
                    marginBottom: "8px",
                  }}
                  formatter={(value) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    "Total Saldo",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="balance"
                  name="Saldo"
                  stroke="#3b82f6"
                  strokeWidth={4}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 2 }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
