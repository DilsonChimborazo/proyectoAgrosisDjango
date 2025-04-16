import { useState, useEffect } from "react";
import { useMideBySensorId, Mide } from "../hooks/iot/mide/useMideBySensorId";
import { useParams } from "react-router-dom";
import Tabla from "../components/globales/Tabla";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface TableData {
  id: number;
  fecha: string;
  valor: number;
  unidad: string;
}

const HistoricalDataTable = () => {
  const { sensorId } = useParams();
  const selectedSensor = Number(sensorId);

  const { data: sensorReadings, sensor } = useMideBySensorId(selectedSensor);

  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [filterType, setFilterType] = useState<"day" | "month" | "year">("day");
  const [showFilter, setShowFilter] = useState(false); 

  useEffect(() => {
    if (!sensorReadings?.length || !selectedSensor) {
      setFilteredData([]);
      return;
    }

    const formattedReadings = sensorReadings.map((reading: Mide) => {
      const fecha = new Date(reading.fecha_medicion);
      return {
        id: reading.id,
        fecha: fecha.toLocaleString(),
        valor: Number(reading.valor_medicion),
        unidad: sensor?.unidad_medida || "",
        rawDate: fecha,
      };
    });

    let filtered = formattedReadings;

    if (selectedDate) {
      filtered = formattedReadings.filter((reading) => {
        const r = reading.rawDate;
        const d = selectedDate;

        if (filterType === "day") {
          return (
            r.getDate() === d.getDate() &&
            r.getMonth() === d.getMonth() &&
            r.getFullYear() === d.getFullYear()
          );
        } else if (filterType === "month") {
          return (
            r.getMonth() === d.getMonth() &&
            r.getFullYear() === d.getFullYear()
          );
        } else if (filterType === "year") {
          return r.getFullYear() === d.getFullYear();
        }
        return true;
      });
    }

    const cleaned = filtered.map(({ rawDate, ...item }) => item);

    setFilteredData(cleaned);
  }, [sensorReadings, selectedSensor, sensor, selectedDate, filterType]);

  return (
    <div className="mt-6 p-6 bg-white rounded-3xl ">
      <h2 className="text-xl font-semibold">
        <div className="flex justify-between items-center mb-4">
            Datos del Sensor: {sensor?.nombre_sensor}
        </div>
      </h2>

      <button
        onClick={() => setShowFilter(!showFilter)}
        className="mb-4  px-4 py-2 rounded hover:bg-green-700 hover:text-white shadow-md"
      >
        {showFilter ? "Ocultar Filtro" : "Seleccionar una Fecha"}
      </button>
      <div className="flex">

      {showFilter && (
        <div className="items-center w-1/5 h-52 shadow-md rounded-3xl mx-7  p-5 relative">
          <label className="text-sm text-gray-600 px-3">Filtrar por:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as any)}
            className="border px-2 py-1 rounded w-full mb-2"
          >
            <option value="day">Día</option>
            <option value="month">Mes</option>
            <option value="year">Año</option>
          </select>

          <div className="p-2 relative">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat={
                filterType === "day"
                  ? "dd/MM/yyyy"
                  : filterType === "month"
                  ? "MM/yyyy"
                  : "yyyy"
              }
              showMonthYearPicker={filterType === "month"}
              showYearPicker={filterType === "year"}
              className="border px-2 py-1 pr-8 rounded w-full"
              placeholderText="Selecciona fecha"
            />

            {selectedDate && (
              <button
                onClick={() => setSelectedDate(null)}
                className="absolute right-2 top-1/2 px-3 transform -translate-y-1/2 text-red-400 font-bold text-lg hover:text-red-800"
              >
                X
              </button>
            )}
          </div>
        </div>
      )}
        <div className="w-full">
          <Tabla
          title="Registros del Sensor"
          headers={["ID", "Fecha", "Valor", "Unidad"]}
          data={filteredData}
          onClickAction={(row) => {
            console.log("🖱️ Click en fila:", row);
          }}
          onUpdate={() => {
            alert("No puedes actualizar mediciones");
          }}
          onCreate={() => {
            alert("No puedes crear mediciones");
          }}
          createButtonTitle="Nuevo Registro"
          />
        </div>
      </div>

    </div>
  );
};

export default HistoricalDataTable;
