import React, { useState } from "react";
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
  Activity,
  Home,
  Wallet,
  TrendingUp,
  TrendingDown,
  Users,
} from "lucide-react";

// --- MOCK DATA (Mensimulasikan response dari backend ReportController) ---
const mockChartData = [
  {
    bulan_angka: 1,
    bulan: "Jan",
    pemasukan: 1725000,
    pengeluaran: 500000,
    saldo_sisa: 1225000,
  },
  {
    bulan_angka: 2,
    bulan: "Feb",
    pemasukan: 1725000,
    pengeluaran: 600000,
    saldo_sisa: 2350000,
  },
  {
    bulan_angka: 3,
    bulan: "Mar",
    pemasukan: 1500000,
    pengeluaran: 800000,
    saldo_sisa: 3050000,
  },
  {
    bulan_angka: 4,
    bulan: "Apr",
    pemasukan: 1725000,
    pengeluaran: 400000,
    saldo_sisa: 4375000,
  },
  {
    bulan_angka: 5,
    bulan: "Mei",
    pemasukan: 1600000,
    pengeluaran: 1200000,
    saldo_sisa: 4775000,
  },
  {
    bulan_angka: 6,
    bulan: "Jun",
    pemasukan: 1725000,
    pengeluaran: 300000,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 7,
    bulan: "Jul",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 8,
    bulan: "Agu",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 9,
    bulan: "Sep",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 10,
    bulan: "Okt",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 11,
    bulan: "Nov",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
  {
    bulan_angka: 12,
    bulan: "Des",
    pemasukan: 0,
    pengeluaran: 0,
    saldo_sisa: 6200000,
  },
];

const StatCard = ({ title, value, icon: Icon, colorClass, subtitle }) => (
  <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 flex items-center space-x-5 hover:shadow-md transition-shadow">
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

export default function DashboardPage() {
  const [selectedYear, setSelectedYear] = useState("2026");

  // Komponen Helper untuk Card Statistik di atas

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* HEADER DASHBOARD */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">
            Dashboard Statistik
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Ringkasan kondisi hunian dan keuangan RT tahun berjalan
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500 font-medium">Tahun:</span>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="bg-white border border-gray-200 text-gray-700 text-sm rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="2026">2026</option>
            <option value="2025">2025</option>
          </select>
        </div>
      </div>

      {/* TOP STATS CARDS (4 Kolom di Desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Saldo Kas RT Saat Ini"
          value="Rp 6.200.000"
          icon={Wallet}
          colorClass="bg-blue-600"
          subtitle="Akumulasi hingga bulan ini"
        />
        <StatCard
          title="Total Pemasukan (Thn Ini)"
          value="Rp 9.600.000"
          icon={TrendingUp}
          colorClass="bg-emerald-500"
        />
        <StatCard
          title="Total Pengeluaran (Thn Ini)"
          value="Rp 3.400.000"
          icon={TrendingDown}
          colorClass="bg-rose-500"
        />
        <div className="flex flex-col gap-4">
          {/* Card Mini untuk status hunian */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Home className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Rumah Dihuni / Kosong
              </p>
              <p className="font-bold text-gray-800">
                15 <span className="text-gray-300 mx-1">/</span> 5
              </p>
            </div>
          </div>
          {/* Card Mini untuk status warga */}
          <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 flex items-center space-x-4">
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">
                Total Warga Terdaftar
              </p>
              <p className="font-bold text-gray-800">12 Orang</p>
            </div>
          </div>
        </div>
      </div>

      {/* CHARTS AREA */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: Pemasukan vs Pengeluaran (Bar Chart) - Mengambil porsi 2/3 layar */}
        {/* Hapus flex-col agar container tidak ambigu */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Arus Kas Bulanan
            </h3>
            <p className="text-sm text-gray-500">
              Perbandingan uang masuk (iuran) dan keluar
            </p>
          </div>
          {/* Berikan nilai min-height eksplisit agar chart tidak mengecil jadi 0 */}
          <div className="w-full h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={mockChartData}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="bulan"
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
                  dataKey="pemasukan"
                  name="Pemasukan"
                  fill="#10b981"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
                <Bar
                  dataKey="pengeluaran"
                  name="Pengeluaran"
                  fill="#f43f5e"
                  radius={[4, 4, 0, 0]}
                  barSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: Saldo Kumulatif (Line Chart) - Mengambil porsi 1/3 layar */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-800">
              Pertumbuhan Saldo RT
            </h3>
            <p className="text-sm text-gray-500">Akumulasi sisa kas berjalan</p>
          </div>
          <div className="w-full h-80 min-h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={mockChartData}
                margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f3f4f6"
                />
                <XAxis
                  dataKey="bulan"
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
                  formatter={(value) => [
                    `Rp ${value.toLocaleString("id-ID")}`,
                    "Total Saldo",
                  ]}
                />
                <Line
                  type="monotone"
                  dataKey="saldo_sisa"
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
