import { useState, useMemo } from "react";
import { Pagination } from "@heroui/react";
import Button from "./Button";

interface TablaProps<T> {
  title: string;
  headers: string[];
  data: T[];
  onEdit: (row: T) => void;
  onClickAction: (row: T) => void;
  onUpdate: (row: T) => void;
  rowsPerPage?: number;
}


const Tabla = <T extends { [key: string]: any }>({
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
    <div className="overflow-x-auto rounded-xl p-6  shadow-lg">
      <div className="flex justify-between items-center bg-gray-50 p-4 rounded-t-xl border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 uppercase">{title}</h2>
        <input
          type="text"
          placeholder="Buscar..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      <table className="w-full border-collapse  overflow-hidden">
        <thead>
          <tr className="bg-gradient-to-r from-green-700 to-green-700 text-white">
            {headers.map((header, index) => (
              <th
                key={index}
                className="px-6 py-4 text-sm font-bold uppercase border-b  text-left"
              >
                {header}
              </th>
            ))}
            <th className="px-6 py-4 text-sm font-bold uppercase border-b  text-center">
              Acciones
            </th>
            <th className="px-6 py-3 text-sm font-bold uppercase border border-gray-400">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {paginatedData.map((row, index) => (
            <tr
              key={row.id || index}
              className={`${
                index % 2 === 0 ? "bg-gray-50" : "bg-white"
              }   hover:bg-green-100 transition duration-300 ease-in-out`}
            >
              {Object.keys(row).map((key, cellIndex) => (
                <td
                  key={cellIndex}
                  className="px-6 py-4 text-sm text-gray-800"
                >
                  {row[key] !== null && row[key] !== undefined ? row[key] : "—"}
                </td>
              ))}
              <td className="px-6 py-4 text-center flex justify-center gap-3">
                <Button
                  text="Editar"
                  onClick={() => onUpdate(row)}
                  variant="success"
                />
              </td>
              <td className="px-6 py-3 text-center border border-gray-300">
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

      <div className="flex justify-end mt-4 p-4 rounded-b-xl ">
        <Pagination total={totalPages} page={currentPage} onChange={setCurrentPage} />
      </div>
    </div>
  );
};

export default Tabla;
