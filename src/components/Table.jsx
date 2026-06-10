import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {columns.map((col, index) => (
                <th
                  key={index}
                  className="px-6 py-4 font-semibold text-gray-700 whitespace-nowrap"
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-8 text-center text-gray-500"
                >
                  Tidak ada data yang tersedia.
                </td>
              </tr>
            ) : (
              data.map((row, rowIndex) => (
                <tr
                  key={row.id || rowIndex}
                  className="hover:bg-gray-50 transition-colors"
                >
                  {columns.map((col, colIndex) => (
                    <td key={colIndex} className="px-6 py-4">
                      {/* Jika kolom memiliki fungsi custom render, jalankan fungsinya. 
                          Jika tidak, panggil langsung datanya menggunakan accessor */}
                      {col.render ? col.render(row) : row[col.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
