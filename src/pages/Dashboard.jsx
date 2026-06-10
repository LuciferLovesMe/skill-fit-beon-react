import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Activity } from "lucide-react";

const mockChartData = [
  { bulan: "Jan", pemasukan: 1200000, pengeluaran: 500000, saldo: 700000 },
  { bulan: "Feb", pemasukan: 1350000, pengeluaran: 600000, saldo: 1450000 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Ringkasan Sistem</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Kamu bisa memisahkan Card ini jadi komponen kecil juga nantinya */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center space-x-4">
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 font-medium">Total Rumah</p>
            <h3 className="text-2xl font-bold text-gray-800">20</h3>
          </div>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6">
          Grafik Kas (Tahun Ini)
        </h3>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={mockChartData}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
              />
              <XAxis dataKey="bulan" axisLine={false} tickLine={false} />
              <YAxis
                axisLine={false}
                tickLine={false}
                tickFormatter={(value) => `Rp ${value / 1000}k`}
              />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="pemasukan"
                name="Pemasukan"
                stroke="#10B981"
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="pengeluaran"
                name="Pengeluaran"
                stroke="#EF4444"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
