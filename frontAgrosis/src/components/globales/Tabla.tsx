import { useState } from "react";
import { Pagination } from "@heroui/react";
import Button from "./Button";

interface TablaProps<T> {
  title: string;
  headers: string[];
  data: T[];
  onClickAction: (row: T) => void;
  rowsPerPage?: number;
}

const Tabla = <T extends { [key: string]: any }>({
  title,
  headers,
  data,
  onClickAction,
  rowsPerPage = 10,
}: TablaProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(data.length / rowsPerPage);

  // Datos paginados
  const paginatedData = data.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <caption className="text-lg font-bold text-gray-800 bg-white uppercase p-2">
          {title}
        </caption>
        <thead>
          <tr className="bg-gradient-to-r from-green-700 to-green-700 text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-sm font-bold uppercase border border-gray-400">
                {header}
              </th>
            ))}
            <th className="px-6 py-3 text-sm font-bold uppercase border border-gray-400">Acción</th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              } border border-gray-300 hover:bg-yellow-100 transition duration-300 ease-in-out`}
            >
              {Object.keys(row).map((key, cellIndex) => (
                <td key={cellIndex} className="px-6 py-3 text-sm border border-gray-300 text-gray-700">
                  {row[key] !== null && row[key] !== undefined ? row[key] : "—"}
                </td>
              ))}
              <td className="px-6 py-3 text-center border border-gray-300">
                <Button text="Ver detalles" onClick={() => onClickAction(row)} variant="success" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Tabla;
