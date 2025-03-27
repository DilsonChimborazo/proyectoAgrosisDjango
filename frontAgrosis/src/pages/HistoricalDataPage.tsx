import { useState, useEffect } from "react";
import { useMideBySensorId, Mide, Sensor } from "../hooks/iot/mide/useMideBySensorId";
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
import Tabla from "../components/globales/Tabla";

// Interfaces para tipado
interface ChartDataPoint {
  fecha: string; // Fecha completa (día, mes, año, hora)
  valor: number;
}

interface TableData {
  id: number;
  fecha: string; // Fecha completa (día, mes, año, hora)
  valor: number;
  unidad: string;
}

const HistoricalDataPage = () => {
  const { sensorId } = useParams();
  const selectedSensor = Number(sensorId);
  const { readings: sensorReadings, sensor, isLoading, error } = useMideBySensorId(selectedSensor);
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined); // Sin fecha inicial
  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [showFilters, setShowFilters] = useState(true);
  const navigate = useNavigate();

  // Obtener nombre del sensor
  const getSensorName = () => {
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  // Obtener unidad del sensor
  const getSensorUnit = () => {
    return sensor?.unidad_medida || "";
  };

  // Función para parsear fechas de manera segura
  const parseDate = (dateString: string): Date => {
    const parsedDate = new Date(dateString);
    if (isNaN(parsedDate.getTime())) {
      console.error(`Fecha inválida: ${dateString}`);
      return new Date(); // Fallback a la fecha actual si falla el parseo
    }
    return parsedDate;
  };

  // Cargar datos históricos y preparar datos para tabla y gráfico
  useEffect(() => {
    if (!sensorReadings?.length || !selectedSensor) {
      console.log("No hay datos históricos o sensor no válido");
      setFilteredData([]);
      setChartData([]);
      return;
    }

    // Transformar las lecturas históricas en el formato necesario
    const formattedReadings = sensorReadings
      .map((reading: Mide) => {
        const fecha = parseDate(reading.fecha_medicion);
        return {
          id: reading.id,
          fecha: fecha.toLocaleString(), // Fecha completa (día, mes, año, hora)
          valor: Number(reading.valor_medicion),
          unidad: getSensorUnit(),
        };
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    console.log("formattedReadings:", formattedReadings);

    // Aplicar filtros de fecha solo si hay una fecha seleccionada
    let filtered = formattedReadings;
    if (selectedDate) {
      filtered = formattedReadings.filter((reading) => {
        const readingDate = parseDate(reading.fecha);
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

    console.log("filtered:", filtered);

    // Preparar datos para la tabla
    setFilteredData(filtered);

    // Preparar datos para el gráfico
    const chartFormattedData = filtered.map((reading) => ({
      fecha: parseDate(reading.fecha).toLocaleString(), // Fecha completa en el gráfico
      valor: reading.valor,
    }));
    setChartData(chartFormattedData);

    console.log("chartData:", chartFormattedData);
  }, [sensorReadings, selectedSensor, filterType, selectedDate, sensor]);

  // WebSocket para datos en tiempo real
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.0.113:8000/ws/api/mide/");
    ws.onopen = () => console.log("✅ Conectado al WebSocket de mediciones");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Dato recibido del WebSocket:", data);

        // Solo procesar datos del sensor seleccionado
        if (data.fk_id_sensor === selectedSensor) {
          const fecha = parseDate(data.fecha_medicion);
          const newReading: TableData = {
            id: data.id || Date.now(), // Fallback para el ID si no viene en el mensaje
            fecha: fecha.toLocaleString(),
            valor: Number(data.valor_medicion),
            unidad: getSensorUnit(),
          };

          // Actualizar datos históricos (para la tabla y el filtrador)
          setFilteredData((prev) => {
            const updated = [...prev, newReading].sort(
              (a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime()
            );
            // Aplicar filtro de fecha si está activo
            if (selectedDate) {
              return updated.filter((reading) => {
                const readingDate = parseDate(reading.fecha);
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
            return updated;
          });

          // Actualizar datos del gráfico
          setChartData((prev) => {
            const updatedChartData = [
              ...prev,
              {
                fecha: fecha.toLocaleString(),
                valor: Number(data.valor_medicion),
              },
            ].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
            return updatedChartData;
          });
        }
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket:", error);
      }
    };
    ws.onclose = () => console.log("⚠ Desconectado del WebSocket de mediciones");
    ws.onerror = (error) => console.error("⚠ Error en WebSocket de mediciones:", error);

    return () => ws.close();
  }, [selectedSensor, filterType, selectedDate]);

  // Manejo de errores y carga
  if (isLoading) return <p className="text-center text-gray-500">Cargando datos...</p>;
  if (error) return <p className="text-center text-red-500">Error al cargar los datos: {error.message}</p>;
  if (!sensor) return <p className="text-center text-red-500">Sensor no encontrado</p>;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col space-y-6 pb-20">
        <span
          onClick={() => navigate("/principal")}
          className="text-green-600 text-2xl cursor-pointer"
        >
          ⬅
        </span>

        <h1 className="text-2xl font-bold text-green-600">
          Datos Históricos de {getSensorName()}
        </h1>

        <div className="flex">
          <div className="w-1/4 p-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              className="bg-green-600 text-white mb-4"
            >
              {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
            </Button>
            {showFilters && (
              <div className="flex flex-col space-y-4">
                <Select
                  onValueChange={(value) =>
                    setFilterType(value as "day" | "week" | "month" | "year")
                  }
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

          <div className="w-3/4 bg-white shadow-md rounded-2xl p-6 flex flex-col items-center">
            <h2 className="text-xl font-semibold text-green-600 mb-4">📊 Gráfico del Sensor</h2>
            {chartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="fecha"
                    tickFormatter={(fecha) => new Date(fecha).toLocaleString()}
                    angle={-45}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis unit={getSensorUnit()} />
                  <Tooltip
                    formatter={(value) => `${value} ${getSensorUnit()}`}
                    labelFormatter={(label) => new Date(label).toLocaleString()}
                  />
                  <Line type="monotone" dataKey="valor" stroke="#22c55e" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-500">
                {selectedDate
                  ? "No hay datos para la fecha seleccionada"
                  : "No hay datos para mostrar el gráfico"}
              </p>
            )}
          </div>
        </div>

        {/* Tabla de datos históricos */}
        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-green-600 mb-4">📋 Datos Históricos</h2>
          <Tabla
            title="Mediciones Históricas"
            headers={["ID", "Fecha", "Valor", "Unidad"]}
            data={filteredData}
            onClickAction={(row) => console.log("Ver detalles de:", row)}
            onUpdate={(row) => console.log("Actualizar:", row)}
            onCreate={() => console.log("Crear nuevo dato")}
            rowsPerPage={10}
            createButtonTitle="Crear Medición"
          />
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataPage;