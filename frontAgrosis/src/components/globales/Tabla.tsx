import { useState, useMemo } from "react";
import { Pagination } from "@heroui/react";
import Button from "./Button";

interface TablaProps<T> {
  title: string;
  headers: string[];
  data: T[];
  onClickAction: (row: T) => void;
  onUpdate: (row: T) => void;
  rowsPerPage?: number;
}

const Tabla = <T extends { id: number | string; [key: string]: any }>({
  title,
  headers,
  data,
  onClickAction,
  onUpdate,
  rowsPerPage = 10,
}: TablaProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");

  // Filtrar los datos
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  // Paginación
  const paginatedData = useMemo(() => {
    return filteredData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [filteredData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  return (
    <div className="overflow-x-auto  rounded-lg p-4">
      <div className="flex justify-between items-center bg-white p-3">
        <h2 className="text-lg font-bold text-gray-800 uppercase">{title}</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2"
        />
      </div>

      <table className="min-w-full border  border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-green-700 to-green-700 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-3 text-sm font-bold uppercase border border-gray-400"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={row.id || index}
              className={`${
                index % 2 === 0 ? "bg-white" : "bg-gray-100"
              } border border-gray-300 hover:bg-yellow-100 transition duration-300 ease-in-out`}
            >
              {Object.keys(row).map((key, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-3 text-sm border border-gray-300 text-gray-700"
                >
                  {row[key] !== null && row[key] !== undefined ? row[key] : "—"}
                </td>
              ))}
              <td className="px-6 py-3 text-center border flex justify-center items-center border-gray-300 gap-2">
                <Button
                  text="Ver detalles"
                  onClick={() => onClickAction(row)}
                  variant="success"
                />

                <Button
                  text="Actualizar"
                  onClick={() => onUpdate(row)}
                  variant="warning"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="flex justify-end mt-4">
        <Pagination
          total={totalPages}
          page={currentPage}
          onChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Tabla;
