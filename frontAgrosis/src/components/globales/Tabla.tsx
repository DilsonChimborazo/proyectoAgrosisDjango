import Button from "./Button";

interface TablaProps<T> {
  title: string;
  headers: string[];
  data: T[]; 
  onClickAction: (row: T) => void; 
}

const Tabla = <T extends { [key: string]: any }>({title, headers, data, onClickAction }: TablaProps<T>) => {
  return (
    <div className="overflow-x-auto  rounded-lg p-4">
      <table className="min-w-full border border-gray-300  rounded-lg shadow-md">
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
                <Button text="Ver detalles" onClick={() => onClickAction(row)} variant="success" />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};


export default Tabla;
