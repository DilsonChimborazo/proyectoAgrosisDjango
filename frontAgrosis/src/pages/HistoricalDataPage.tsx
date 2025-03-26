import { useState, useEffect } from "react";
import { useMide } from "../hooks/iot/mide/useMide";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useNavigate, useParams } from "react-router-dom";
import Tabla from "../components/globales/Tabla"; // Importamos el componente Tabla

const HistoricalDataPage = () => {
  const { sensorData, sensors } = useMide();
  const { sensorId } = useParams();
  const selectedSensor = Number(sensorId);
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<any[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  // Obtener el nombre del sensor
  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  // Obtener la unidad de medida del sensor
  const getSensorUnit = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    switch (sensor?.tipo_sensor.toLowerCase()) {
      case "temperatura":
        return "°C";
      case "humedad":
        return "%";
      case "luz":
        return "lux";
      case "viento":
        return "m/s";
      case "presion":
        return "hPa";
      case "aire":
        return "ppm";
      default:
        return "";
    }
  };

  // Procesar datos históricos y en tiempo real
  useEffect(() => {
    console.log("📊 sensorData recibido en HistoricalDataPage:", sensorData);
    console.log("📊 Sensor seleccionado (ID):", selectedSensor);

    if (!sensorData?.length || !selectedSensor) {
      console.log("⚠ No hay datos o sensor seleccionado:", { sensorData, selectedSensor });
      setFilteredData([]);
      setChartsData([]);
      return;
    }

    // Procesar datos para gráficos y tabla
    const sensorReadings = sensorData
      .filter((reading) => {
        const matchesSensor = reading.fk_id_sensor === selectedSensor;
        if (!matchesSensor) {
          console.log(`⚠ Dato descartado (no coincide con el sensor ${selectedSensor}):`, reading);
        }
        return matchesSensor;
      })
      .map((reading) => {
        const fecha = new Date(reading.fecha_medicion);
        console.log(`📅 Procesando fecha para dato: ${reading.fecha_medicion} -> ${fecha.toISOString()}`);
        return {
          id: `${reading.fk_id_sensor}-${reading.fecha_medicion}`, // ID único para la tabla
          fecha: fecha.toLocaleString(),
          fechaRaw: fecha,
          valor: Number(reading.valor_medicion),
          unidad: getSensorUnit(selectedSensor),
        };
      })
      .sort((a, b) => a.fechaRaw.getTime() - b.fechaRaw.getTime());

    console.log("📊 Datos procesados para el sensor:", sensorReadings);

    // Datos para el gráfico (mostrar todos los datos en tiempo real)
    setChartsData(sensorReadings);

    // Filtrar datos para la tabla según el tipo de filtro y la fecha seleccionada
    let filtered = sensorReadings;
    if (selectedDate) {
      filtered = sensorReadings.filter((reading) => {
        const readingDate = reading.fechaRaw;
        console.log(`📅 Filtrando dato: ${readingDate.toISOString()} (filtro: ${selectedDate.toISOString()})`);
        if (filterType === "day") {
          return (
            readingDate.getDate() === selectedDate.getDate() &&
            readingDate.getMonth() === selectedDate.getMonth() &&
            readingDate.getFullYear() === selectedDate.getFullYear()
          );
        } else if (filterType === "week") {
          const startOfWeek = new Date(selectedDate);
          startOfWeek.setDate(selectedDate.getDate() - selectedDate.getDay());
          const endOfWeek = new Date(startOfWeek);
          endOfWeek.setDate(startOfWeek.getDate() + 6);
          return readingDate >= startOfWeek && readingDate <= endOfWeek;
        } else if (filterType === "month") {
          return (
            readingDate.getMonth() === selectedDate.getMonth() &&
            readingDate.getFullYear() === selectedDate.getFullYear()
          );
        } else if (filterType === "year") {
          return readingDate.getFullYear() === selectedDate.getFullYear();
        }
        return true;
      });
    }

    console.log("📊 Datos filtrados para la tabla:", filtered);
    setFilteredData(filtered);
  }, [sensorData, selectedSensor, filterType, selectedDate]);

  // Funciones para las acciones de la tabla
  const handleRowClick = (row: any) => {
    console.log("Ver detalles de la fila:", row);
    // Aquí puedes implementar una acción, como mostrar más detalles en un modal
  };

  const handleUpdate = (row: any) => {
    console.log("Actualizar fila:", row);
    // Aquí puedes implementar una acción para actualizar el dato
  };

  const handleCreate = () => {
    console.log("Crear nuevo dato");
    // Aquí puedes implementar una acción para crear un nuevo dato
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col space-y-6 pb-20">
        {/* Botón de regreso */}
        <span
          onClick={() => navigate("/principal")}
          className="text-green-600 text-2xl cursor-pointer"
        >
          ⬅
        </span>

        {/* Título de la página */}
        <h1 className="text-2xl font-bold text-green-600">
          Datos Históricos de {getSensorName(selectedSensor)}
        </h1>

        {/* Filtros de fecha */}
        <div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-green-600 text-white mb-4"
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          {showFilters && (
            <div className="flex space-x-4">
              <Select
                onValueChange={(value) => setFilterType(value as "day" | "week" | "month" | "year")}
              >
                <SelectTrigger className="w-[150px] border-green-600">
                  <SelectValue placeholder="Filtrar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Día</SelectItem>
                  <SelectItem value="week">Semana</SelectItem>
                  <SelectItem value="month">Mes</SelectItem>
                  <SelectItem value="year">Año</SelectItem>
                </SelectContent>
              </Select>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border-green-600"
              />
            </div>
          )}
        </div>

        {/* Tabla de datos históricos usando el componente Tabla */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">📋 Datos Históricos</h2>
          <Tabla
            title="Mediciones Históricas"
            headers={["Fecha", "Valor", "Unidad"]}
            data={filteredData.map((data) => ({
              id: data.id,
              fecha: data.fecha,
              valor: data.valor,
              unidad: data.unidad,
            }))}
            onClickAction={handleRowClick}
            onUpdate={handleUpdate}
            onCreate={handleCreate}
            rowsPerPage={10}
            createButtonTitle="Crear Medición"
          />
        </div>

        {/* Gráfico en tiempo real */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">📊 Gráfico del Sensor</h2>
          {chartsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis unit={getSensorUnit(selectedSensor)} />
                <Tooltip formatter={(value) => `${value} ${getSensorUnit(selectedSensor)}`} />
                <Line type="monotone" dataKey="valor" stroke="#22c55e" />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No hay datos para mostrar el gráfico</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataPage;