interface TablaProps<T> {
  headers: string[]; // Los encabezados de la tabla
  data: T[]; // Datos genéricos que puede ser cualquier tipo
  onClickAction: (row: T) => void; // Función para manejar la acción de clic
}

interface TablaProps<T> {
  headers: string[]; // Encabezados de la tabla
  data: T[]; // Datos genéricos
  onClickAction: (row: T) => void; // Función para manejar la acción de clic
}

interface TablaProps<T> {
  headers: string[]; // Encabezados de la tabla
  data: T[]; // Datos genéricos
  onClickAction: (row: T) => void; // Función para manejar la acción de clic
}

const Tabla = <T extends { [key: string]: any }>({ headers, data, onClickAction }: TablaProps<T>) => {
  return (
    <div className="overflow-x-auto  shadow-lg rounded-lg p-4">
      <table className="min-w-full border border-gray-300 rounded-lg shadow-md">
        <thead>
          <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            {headers.map((header, index) => (
              <th key={index} className="px-6 py-3 text-sm font-bold uppercase border border-gray-400">
                {header}
              </th>
            ))}
            <th className="px-6 py-3 text-sm font-bold uppercase border border-gray-400">Acción</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className={`${
                index % 2 === 0 ? 'bg-white' : 'bg-gray-100'
              } border border-gray-300 hover:bg-yellow-100 transition duration-300 ease-in-out`}
            >
              {Object.keys(row).map((key, cellIndex) => (
                <td key={cellIndex} className="px-6 py-3 text-sm border border-gray-300 text-gray-700">
                  {row[key] !== null && row[key] !== undefined ? row[key] : '—'}
                </td>
              ))}
              <td className="px-6 py-3 text-center border border-gray-300">
                <button
                  onClick={() => onClickAction(row)}
                  className="bg-green-500 text-white px-3 py-2 rounded-lg shadow-md hover:bg-green-600 transform hover:scale-105 transition duration-300 ease-in-out"
                >
                  Ver detalles
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Tabla;
