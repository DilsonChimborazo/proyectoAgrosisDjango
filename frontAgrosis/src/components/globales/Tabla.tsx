import { useState, useMemo } from "react";
import { Pagination, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Button as HerouiButton } from "@heroui/react";
import { ChevronDown, MoreVertical, Plus } from "lucide-react";

// Definimos la interfaz para las columnas de la tabla
interface Column {
  name: string; // Nombre de la columna (se muestra en el encabezado)
  key: string; // Clave única para identificar la columna (usada para acceder a los datos)
}

// Definimos las propiedades que recibe el componente Tabla
interface TablaProps<T> {
  title: string; // Título de la tabla
  headers: string[]; // Lista de encabezados de las columnas
  data: T[]; // Datos que se mostrarán en la tabla
  onClickAction: (row: T) => void; // Función que se ejecuta al hacer clic en "Ver detalles" de una fila
  onUpdate: (row: T) => void; // Función que se ejecuta al hacer clic en "Actualizar" de una fila
  onCreate: () => void; // Función que se ejecuta al hacer clic en el botón de crear
  rowsPerPage?: number; // Número de filas por página (opcional, por defecto 5)
  createButtonTitle?: string; // Título del botón de crear (opcional, por defecto vacío)
}

// Componente Tabla, que es genérico para manejar diferentes tipos de datos
const Tabla = <T extends { [key: string]: any }>({
  title,
  headers,
  data,
  onClickAction,
  onUpdate,
  onCreate,
  rowsPerPage = 5, // Valor por defecto de filas por página
  createButtonTitle = "", // Valor por defecto del título del botón de crear
}: TablaProps<T>) => {
  // Estados para manejar la paginación, filtros, ordenamiento y columnas visibles
  const [currentPage, setCurrentPage] = useState(1); // Página actual de la paginación
  const [filter, setFilter] = useState(""); // Filtro de búsqueda
  const [sortColumn, setSortColumn] = useState<string | null>(null); // Columna por la que se ordena
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc"); // Dirección del ordenamiento (ascendente o descendente)
  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    headers.map((header) => header.toLowerCase().replace(/\s+/g, "_")) // Inicializamos las columnas visibles con las claves de los encabezados
  );

  // Creamos las columnas dinámicamente a partir de los encabezados
  const columns: Column[] = useMemo(() => {
    return headers.map((header) => ({
      name: header, // Nombre del encabezado
      key: header.toLowerCase().replace(/\s+/g, "_"), // Clave única en minúsculas y sin espacios
    }));
  }, [headers]);

  // Filtramos los datos según el valor del filtro
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      Object.values(row).some((value) =>
        value?.toString().toLowerCase().includes(filter.toLowerCase()) // Filtramos filas que contengan el texto del filtro
      )
    );
  }, [data, filter]);

  // Ordenamos los datos según la columna seleccionada y la dirección
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData; // Si no hay columna para ordenar, devolvemos los datos filtrados sin cambios

    return [...filteredData].sort((a, b) => {
      const valueA = a[sortColumn]; // Valor de la columna en la fila A
      const valueB = b[sortColumn]; // Valor de la columna en la fila B

      // Manejo de valores nulos
      if (valueA == null && valueB == null) return 0;
      if (valueA == null) return sortDirection === "asc" ? 1 : -1;
      if (valueB == null) return sortDirection === "asc" ? -1 : 1;

      // Ordenamiento especial para fechas
      if (sortColumn.toLowerCase().includes("fecha")) {
        const dateA = new Date(valueA);
        const dateB = new Date(valueB);
        return sortDirection === "asc"
          ? dateA.getTime() - dateB.getTime()
          : dateB.getTime() - dateA.getTime();
      }

      // Ordenamiento para números
      if (!isNaN(valueA as number) && !isNaN(valueB as number)) {
        return sortDirection === "asc"
          ? Number(valueA) - Number(valueB)
          : Number(valueB) - Number(valueA);
      }

      // Ordenamiento para texto
      return sortDirection === "asc"
        ? String(valueA).localeCompare(String(valueB))
        : String(valueB).localeCompare(String(valueA));
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginamos los datos ordenados
  const paginatedData = useMemo(() => {
    return sortedData.slice(
      (currentPage - 1) * rowsPerPage, // Inicio de la página
      currentPage * rowsPerPage // Fin de la página
    );
  }, [sortedData, currentPage, rowsPerPage]);

  // Calculamos el número total de páginas
  const totalPages = Math.ceil(sortedData.length / rowsPerPage);

  // Función para manejar el ordenamiento al hacer clic en un encabezado
  const handleSort = (columnKey: string) => {
    if (sortColumn === columnKey) {
      // Si ya estamos ordenando por esta columna, cambiamos la dirección
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      // Si es una nueva columna, ordenamos en ascendente
      setSortColumn(columnKey);
      setSortDirection("asc");
    }
  };

  // Funciones para ir a la primera y última página
  const handleFirstPage = () => setCurrentPage(1);
  const handleLastPage = () => setCurrentPage(totalPages);

  // Función para alternar la visibilidad de una columna
  const toggleColumn = (columnKey: string) => {
    setVisibleColumns((prev) =>
      prev.includes(columnKey)
        ? prev.filter((key) => key !== columnKey) // Si la columna está visible, la ocultamos
        : [...prev, columnKey] // Si no está visible, la mostramos
    );
  };

  // Filtramos las columnas visibles
  const visibleColumnsData = columns.filter((column) =>
    visibleColumns.includes(column.key)
  );

  return (
    // Contenedor principal de la tabla con bordes redondeados
    <div className="rounded-3xl m-5  bg-white">
      {/* Sección superior con el título, búsqueda y botones */}
      <div className="flex flex-col sm:flex-row justify-between items-center px-8 py-4 rounded-t-xl p-5">
        {/* Título de la tabla */}
        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 uppercase">{title}</h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          {/* Campo de búsqueda */}
          <input
            type="text"
            placeholder="Buscar..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)} // Actualizamos el filtro al escribir
            className="border rounded-2xl p-2 focus:outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-64"
          />
          {/* Dropdown para seleccionar columnas visibles */}
          <Dropdown>
            <DropdownTrigger>
              <HerouiButton
                className="flex items-center  border focus:ring-2 focus:ring-green-500 rounded-2xl p-6 uppercase"
              >
                columnas
                <ChevronDown size={18} /> {/* Ícono de flecha hacia abajo */}
              </HerouiButton>
            </DropdownTrigger>
            <DropdownMenu aria-label="Seleccionar columnas" className="bg-white">
              {columns.map((column) => (
                <DropdownItem
                  key={column.key}
                  onClick={() => toggleColumn(column.key)} // Alternamos la visibilidad de la columna
                  className="flex items-center"
                >
                  <input
                    type="checkbox"
                    checked={visibleColumns.includes(column.key)} // Marcamos si la columna está visible
                    onChange={() => toggleColumn(column.key)}
                    className="mr-2"
                  />
                  {column.name}
                </DropdownItem>
              ))}
            </DropdownMenu>
          </Dropdown>
          {/* Botón para crear un nuevo elemento */}
          <HerouiButton
            title={createButtonTitle}
            onClick={onCreate} // Ejecutamos la función onCreate al hacer clic
            className="border hover:bg-green-700 hover:text-white uppercase text-center p-6 rounded-2xl"
          >
            <Plus size={18} /> {/* Ícono de "+" */}
            {createButtonTitle}
          </HerouiButton>
        </div>
      </div>

      {/* Mostramos un mensaje si no hay resultados */}
      {sortedData.length === 0 ? (
        <div className="text-center rounded-2xl text-red-500 bg-white m-4">
          No se encontraron resultados.
        </div>
      ) : (
        // Contenedor de la tabla con desplazamiento horizontal si es necesario
        <div className="overflow-x-auto px-7">
          <table className="min-w-full border-separate border-spacing-y-2">
            {/* Encabezado de la tabla */}
            <thead>
              <tr className="bg-green-700 text-white border-2 border-green-900">
                {visibleColumnsData.map((column, index) => (
                  <th
                    key={index}
                    className={`px-8 py-5 text-xs sm:text-sm font-bold uppercase text-center cursor-pointer hover:bg-green-800 transition
                      ${index === 0 ? "rounded-tl-2xl rounded-bl-2xl" : ""}`} // Redondeamos las esquinas izquierda solo en la primera celda
                    onClick={() => handleSort(column.key)} // Ordenamos al hacer clic
                  >
                    <div className="flex items-center justify-between">
                      <span>{column.name}</span>
                      {sortColumn === column.key && (
                        <span className="ml-2">
                          {sortDirection === "asc" ? "↑" : "↓"} {/* Indicador de dirección del ordenamiento */}
                        </span>
                      )}
                    </div>
                  </th>
                ))}
                {/* Columna de acciones con redondeo en las esquinas derecha */}
                <th className="px-2 sm:px-6 py-5 text-sm font-bold uppercase rounded-tr-2xl rounded-br-2xl text-left truncate">
                  Acciones
                </th>
              </tr>
            </thead>
            {/* Cuerpo de la tabla */}
            <tbody className="px-20">
              {paginatedData.map((row, index) => (
                <tr
                  key={row.id || index} // Usamos el id de la fila o el índice como clave
                  className={`${index % 2 === 0 ? "bg-gray-50" : "bg-white"} hover:bg-green-100 transition duration-300 ease-in-out`} // Alternamos colores de fondo
                >
                  {visibleColumnsData.map((column, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-8 py-3 sm:py-4 text-xs sm:text-sm text-gray-800 max-w-[100px] sm:max-w-xs truncate" // Estilo de las celdas
                    >
                      {row[column.key] !== null && row[column.key] !== undefined ? row[column.key] : "—"} {/* Mostramos el valor o un guion si es nulo */}
                    </td>
                  ))}
                  {/* Columna de acciones con un dropdown */}
                  <td className="px-2">
                    <Dropdown>
                      <DropdownTrigger>
                        <HerouiButton
                          variant="bordered"
                          className="p-2 rounded-full hover:bg-gray-200"
                        >
                          <MoreVertical size={18} /> {/* Ícono de más opciones */}
                        </HerouiButton>
                      </DropdownTrigger>
                      <DropdownMenu aria-label="Acciones" className="bg-white">
                        <DropdownItem
                          key="details"
                          onClick={() => onClickAction(row)} // Ejecutamos onClickAction al hacer clic
                          className="text-green-600"
                        >
                          Ver detalles
                        </DropdownItem>
                        <DropdownItem
                          key="update"
                          onClick={() => onUpdate(row)} // Ejecutamos onUpdate al hacer clic
                          className="text-yellow-600"
                        >
                          Actualizar
                        </DropdownItem>
                      </DropdownMenu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación (solo se muestra si hay datos) */}
      {sortedData.length > 0 && (
        <div className="flex justify-center p-5 rounded-b-xl bg-gray-50">
          <div className="flex items-center gap-2 ">
            {/* Botón para ir a la primera página */}
            <button
              onClick={handleFirstPage}
              disabled={currentPage === 1} // Deshabilitado si estamos en la primera página
              className={`p-2 rounded-full  ${
                currentPage === 1
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              } transition duration-200`}
            >
            </button>

            {/* Componente de paginación */}
            <Pagination
              isCompact
              showControls
              showShadow
              color="success"
              page={currentPage}
              total={totalPages}
              onChange={(page) => setCurrentPage(page)} // Actualizamos la página actual
              className="flex items-center gap-2 overflow-hidden"
            />

            {/* Botón para ir a la última página */}
            <button
              onClick={handleLastPage}
              disabled={currentPage === totalPages} // Deshabilitado si estamos en la última página
              className={`p-2 rounded-full ${
                currentPage === totalPages
                  ? "text-gray-400 cursor-not-allowed"
                  : "text-gray-700 hover:bg-gray-200"
              } transition duration-200`}
            >
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tabla;