import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Table({
  columns,
  data,
  emptyMessage = "Data tidak ditemukan.",
  meta,
  onPageChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100 text-gray-700">
            <tr>
              {columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-6 py-4 font-semibold ${col.headerClassName || ""}`}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data && data.length > 0 ? (
              data.map((row, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="hover:bg-blue-50/50 transition-colors group"
                >
                  {columns.map((col, colIndex) => (
                    <td
                      key={colIndex}
                      className={`px-6 py-4 ${col.tdClassName || ""}`}
                    >
                      {/* Render custom JSX jika ada properti 'render', jika tidak tampilkan sesuai 'accessor' */}
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  {emptyMessage}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* FOOTER PAGINATION: Muncul otomatis jika props 'meta' diberikan dan halamannya lebih dari 1 */}
      {meta && meta.last_page > 1 && (
        <div className="px-6 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500 bg-gray-50/50">
          <span>
            Menampilkan halaman{" "}
            <span className="font-semibold text-gray-800">
              {meta.current_page}
            </span>{" "}
            dari{" "}
            <span className="font-semibold text-gray-800">
              {meta.last_page}
            </span>
            <span className="hidden sm:inline"> (Total {meta.total} data)</span>
          </span>
          <div className="flex space-x-2">
            <button
              onClick={() => onPageChange(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="p-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
              title="Halaman Sebelumnya"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => onPageChange(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="p-1.5 border border-gray-200 text-gray-600 rounded-lg hover:bg-white transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center shadow-sm"
              title="Halaman Selanjutnya"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
