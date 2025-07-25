import { useState, useMemo } from "react";
import { Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button as HerouiButton } from "@heroui/react";
import { ChevronDown, MoreVertical, Plus, Search, X } from "lucide-react";

// Definimos la interfaz para las columnas de la tabla
interface Column {
  name: string;
  key: string;
}

// Definimos las propiedades que recibe el componente Tabla
interface TablaProps<T extends Record<string, any>> {
  title: string;
  headers: string[];
  data: T[];
  onClickAction?: (row: T) => void;
  onUpdate?: (row: T) => void;
  onCreate?: () => void;
  rowsPerPageOptions?: number[];
  createButtonTitle?: string;
  extraButton?: React.ReactNode;
  hiddenColumnsByDefault?: string[];
  renderCell?: (row: T, columnKey: string) => React.ReactNode;
  renderRow?: (row: T, index: number) => React.ReactNode;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T) => string;
  showCreateButton?: boolean; // Nueva prop para controlar el botón de Crear
}

const Tabla = <T extends Record<string, any>>({
  title,
  headers,
  data,
  onClickAction,
  onUpdate,
  onCreate,
  rowsPerPageOptions = [5, 10, 20, 50],
  createButtonTitle = "Crear +",
  extraButton,
  hiddenColumnsByDefault = ['id'],
  renderCell,
  onRowClick,
  rowClassName,
  showCreateButton = true, // Por defecto, el botón se muestra
}: TablaProps<T>) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers
      .map((header) =>
        typeof header === 'string'
          ? header.toLowerCase().replace(/\s+/g, "_")
          : ''
      )
      .filter(key => !hiddenColumnsByDefault.includes(key.toLowerCase()))
  );
  const [rowsPerPage, setRowsPerPage] = useState(rowsPerPageOptions[0]);

  const columns: Column[] = useMemo(() => {
    return headers.map((header) => ({
      name: header,
      key: header.toLowerCase().replace(/\s+/g, "_"),
    }));
  }, [headers]);

  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase())
      )
    );
  }, [data, filter]);

  const sortedData = useMemo(() => {
    // Si no hay una columna de ordenamiento seleccionada, invertir el orden para mostrar el último dato primero
    if (!sortColumn) {
      return [...filteredData].reverse(); // Invierte el orden del array (último dato primero)
    }

    // Si hay una columna seleccionada, mantener el ordenamiento existente
    return [...filteredData].sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortDirection === "asc" ? 1 : -1;
      if (valueB == null) return sortDirection === "asc" ? -1 : 1;

      if (sortColumn.toLowerCase().includes("fecha")) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      if (!isNaN(valueA as number) && !isNaN(valueB as number)) {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredData, sortColumn, sortDirection]);

  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage,
      currentPage * rowsPerPage
    );
  }, [sortedData, currentPage, rowsPerPage]);

  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey)
        : [...prev, columnKey]
    );
  };

  const clearFilter = () => {
    setFilter("");
  };

  const handleRowsPerPageChange = (value: string) => {
    setRowsPerPage(Number(value));
    setCurrentPage(1);
  };

  const visibleColumnsData = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  const hasActions = onClickAction || onUpdate;

  return (
    <div className="m-2 sm:m-5 bg-white rounded-3xl">
      <h2 className="text-center text-xl sm:text-3xl font-semibold capitalize p-3">{title}</h2>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 sm:px-8 py-4">
        <div className="relative w-full md:w-1/2">
          <div className="relative flex items-center w-full">
            <Search className="absolute left-3 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border shadow-md rounded-xl pl-10 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full text-sm sm:text-base"
            />
            {filter && (
              <button
                onClick={clearFilter}
                className="absolute right-3 text-red-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <select
              aria-label="Filas por página"
              className="border-2 font-semibold text-green-700 border-green-700 hover:bg-green-700 hover:text-white p-2 rounded-xl shadow-md text-sm w-full sm:w-auto"
              onChange={(e) => handleRowsPerPageChange(e.target.value)}
              value={rowsPerPage}
            >
              {rowsPerPageOptions.map((option) => (
                <option key={option} value={option} className="bg-white text-black">
                  {option} filas
                </option>
              ))}
            </select>

            <Dropdown>
              <DropdownTrigger>
                <HerouiButton className="flex items-center justify-center bg-transparent border-2 font-semibold text-green-700 border-green-700 hover:bg-green-700 hover:text-white p-2 rounded-xl shadow-md text-sm w-full sm:w-auto">
                  Columnas
                  <ChevronDown size={16} className="ml-1" />
                </HerouiButton>
              </DropdownTrigger>
              <DropdownMenu aria-label="Seleccionar columnas">
                {columns.map((column) => (
                  <DropdownItem
                    key={column.key}
                    onClick={() => toggleColumn(column.key)}
                    className="flex items-center"
                  >
                    <input
                      type="checkbox"
                      checked={visibleColumns.includes(column.key)}
                      onChange={() => toggleColumn(column.key)}
                      className="mr-2"
                    />
                    {column.name}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {showCreateButton && onCreate && (
              <HerouiButton
                title={createButtonTitle}
                onClick={onCreate}
                className="bg-transparent border-2 border-green-700 font-semibold text-green-700 hover:bg-green-700 hover:text-white rounded-xl shadow-md flex items-center justify-center text-sm w-full sm:w-auto"
              >
                {createButtonTitle}
                <Plus size={16} className="ml-1" />
              </HerouiButton>
            )}
            {extraButton && <div className="w-full sm:w-auto">{extraButton}</div>}
          </div>
        </div>
      </div>

      {sortedData.length === 0 ? (
        <div className="text-center rounded-2xl text-red-500 bg-white m-4 p-4">
          No se encontraron resultados.
        </div>
      ) : (
        <>
          <div className="hidden sm:block overflow-x-auto px-4 sm:px-7">
            <table className="min-w-full border-separate border-spacing-y-2">
              <thead>
                <tr className="bg-green-700 text-white font-bold">
                  {visibleColumnsData.map((column, index) => (
                    <th
                      key={index}
                      className={`px-3 sm:px-5 text-xs sm:text-sm py-3 sm:py-5 font-bold capitalize text-center cursor-pointer hover:bg-green-800 transition
                        ${index === 0 ? "rounded-tl-2xl rounded-bl-2xl" : ""}
                        ${!hasActions && index === visibleColumnsData.length - 1 ? "rounded-tr-2xl rounded-br-2xl" : ""}`}
                      onClick={() => handleSort(column.key)}
                    >
                      <div className="flex items-center justify-center">
                        <span>{column.name}</span>
                        {sortColumn === column.key && (
                          <span className="ml-2">
                            {sortDirection === "asc" ? "↑" : "↓"}
                          </span>
                        )}
                      </div>
                    </th>
                  ))}
                  {hasActions && (
                    <th className="px-2 sm:px-6 py-3 sm:py-5 text-xs sm:text-sm font-bold capitalize rounded-tr-2xl rounded-br-2xl text-center">
                      Acciones
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => {
                  const rowClass = rowClassName ? rowClassName(row) :
                    `${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-100`;

                  return (
                    <tr
                      key={row.id || index}
                      className={`${rowClass} transition duration-300 ease-in-out ${onRowClick ? 'cursor-pointer' : ''}`}
                      onClick={() => onRowClick && onRowClick(row)}
                    >
                      {visibleColumnsData.map((column, cellIndex) => (
                        <td
                          key={cellIndex}
                          className="px-3 sm:px-8 py-2 sm:py-4 text-xs sm:text-sm text-gray-800 max-w-[80px] sm:max-w-xs truncate"
                        >
                          {renderCell ? renderCell(row, column.key) :
                            (row[column.key] !== null && row[column.key] !== undefined ? row[column.key] : "—")}
                        </td>
                      ))}
                      {hasActions && (
                        <td className="px-2 sm:px-6 py-2 sm:py-4">
                          <Dropdown>
                            <DropdownTrigger>
                              <HerouiButton
                                variant="bordered"
                                className="p-2 rounded-full"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical size={16} />
                              </HerouiButton>
                            </DropdownTrigger>
                            <DropdownMenu
                              aria-label="Acciones"
                              onAction={(key) => {
                                if (key === "details" && onClickAction) onClickAction(row);
                                if (key === "update" && onUpdate) onUpdate(row);
                              }}
                            >
                              <DropdownItem key="details">Ver detalles</DropdownItem>
                              <DropdownItem key="update">Actualizar</DropdownItem>
                            </DropdownMenu>

                          </Dropdown>
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden px-4 space-y-4">
            {paginatedData.map((row, index) => {
              const rowClass = rowClassName ? rowClassName(row) :
                `${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-100`;

              return (
                <div
                  key={row.id || index}
                  className={`${rowClass} rounded-xl shadow-md p-4 ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={() => onRowClick && onRowClick(row)}
                >
                  {visibleColumnsData.map((column, cellIndex) => (
                    <div key={cellIndex} className="flex justify-between py-1 border-b last:border-b-0">
                      <span className="font-semibold text-xs capitalize">{column.name}:</span>
                      <span className="text-xs text-gray-800">
                        {renderCell ? renderCell(row, column.key) :
                          (row[column.key] !== null && row[column.key] !== undefined ? row[column.key] : "—")}
                      </span>
                    </div>
                  ))}
                  {hasActions && (
                    <div className="flex justify-end pt-2">
                      <Dropdown>
                        <DropdownTrigger>
                          <HerouiButton
                            variant="bordered"
                            className="p-2 rounded-full"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <MoreVertical size={16} />
                          </HerouiButton>
                        </DropdownTrigger>
                        <DropdownMenu
                          aria-label="Acciones"
                          onAction={(key) => {
                            if (key === "details" && onClickAction) onClickAction(row);
                            if (key === "update" && onUpdate) onUpdate(row);
                          }}
                        >
                          <DropdownItem key="details">Ver detalles</DropdownItem>
                          <DropdownItem key="update">Actualizar</DropdownItem>
                        </DropdownMenu>
                      </Dropdown>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {sortedData.length > 0 && (
        <div className="flex justify-center p-4 sm:p-5 rounded-b-xl bg-gray-50">
          <Pagination
            isCompact
            showControls
            showShadow
            color="default"
            page={currentPage}
            total={totalPages}
            onChange={(page) => setCurrentPage(page)}
            className="flex items-center gap-2"
          />
        </div>
      )}
    </div>
  );
};

export default Tabla;