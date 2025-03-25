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
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link, useNavigate, useParams } from "react-router-dom";

// Íconos para los sensores
const icons = {
  temperatura: "🌡",
  humedad: "💧",
};

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: any[] }>({});
  const [realTimeData, setRealTimeData] = useState<{ [key: number]: { valor: number; fecha: string } }>({});
  const [sensorDisplayData, setSensorDisplayData] = useState<any[]>([]);

  // Cargar los sensores desde el backend (solo Temperatura y Humedad)
  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      console.warn("⚠ No se recibieron sensores del backend");
      setSensorDisplayData([]);
      return;
    }

    console.log("Sensores recibidos:", sensors); // Depuración para ver qué sensores llegan

    const filteredSensors = sensors.filter((sensor) => {
      const isTempOrHum = sensor.nombre_sensor === "Sensor de temperatura" || sensor.nombre_sensor === "Sensor de Humedad";
      console.log(`Sensor: ${sensor.nombre_sensor}, Incluido: ${isTempOrHum}`); // Depuración
      return isTempOrHum;
    });

    if (filteredSensors.length === 0) {
      console.warn("⚠ No se encontraron sensores de Temperatura o Humedad");
    }

    const initialSensorData = filteredSensors.map((sensor) => {
      let icon = sensor.nombre_sensor === "Sensor de Humedad" ? icons.humedad : icons.temperatura;
      return {
        id: sensor.id,
        nombre: sensor.nombre_sensor,
        valor: "Esperando datos...",
        icon,
      };
    });

    console.log("Datos iniciales de sensores:", initialSensorData); // Depuración
    setSensorDisplayData(initialSensorData);
  }, [sensors]);

  // Conexión al WebSocket
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.100.115:8000/ws/api/mide/");

    ws.onopen = () => {
      console.log("✅ Conectado al WebSocket");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Datos recibidos del WebSocket:", data);

        if (!data.fk_id_sensor || !data.valor_medicion || !data.fecha_medicion) return;

        setRealTimeData((prev) => ({
          ...prev,
          [data.fk_id_sensor]: {
            valor: data.valor_medicion,
            fecha: data.fecha_medicion,
          },
        }));

        setSensorDisplayData((prev) =>
          prev.map((sensor) => {
            if (data.fk_id_sensor === sensor.id) {
              let formattedValue = data.valor_medicion;
              if (sensor.nombre === "Sensor de Temperatura") {
                formattedValue = `${data.valor_medicion}°C`;
              } else if (sensor.nombre === "Sensor de Humedad") {
                formattedValue = `${data.valor_medicion}%`;
              }
              console.log(`Actualizando sensor ${sensor.nombre} con valor ${formattedValue}`); // Depuración
              return { ...sensor, valor: formattedValue };
            }
            return sensor;
          })
        );

        setChartsData((prev) => {
          const sensorId = data.fk_id_sensor;
          const fechaLegible = new Date(data.fecha_medicion).toLocaleTimeString();
          const newDataPoint = {
            fecha: fechaLegible,
            valor: data.valor_medicion,
          };

          if (sensorId === 1 || sensorId === 2) {
            const updatedData = [...(prev[sensorId] || []), newDataPoint];
            if (updatedData.length > 50) updatedData.shift();
            return { ...prev, [sensorId]: updatedData };
          }
          return prev;
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket:", error);
      }
    };

    ws.onclose = () => {
      console.log("⚠ Desconectado del WebSocket");
    };

    ws.onerror = (error) => {
      console.error("⚠ Error en WebSocket:", error);
    };

    return () => {
      ws.close();
    };
  }, []);

  // Preparar datos iniciales para gráficos
  useEffect(() => {
    if (!sensors?.length || !sensorData?.length) {
      console.warn("⚠ No se recibieron datos de sensores o mediciones");
      return;
    }

    const groupedData: { [key: number]: any[] } = {};
    sensorData.forEach((reading) => {
      const sensor = sensors.find((s) => s.id === reading.fk_id_sensor);
      if (sensor && (sensor.nombre_sensor === "Sensor de Temperatura" || sensor.nombre_sensor === "Sensor de Humedad")) {
        if (!groupedData[reading.fk_id_sensor]) {
          groupedData[reading.fk_id_sensor] = [];
        }
        const fechaLegible = new Date(reading.fecha_medicion).toLocaleTimeString();
        groupedData[reading.fk_id_sensor].push({
          fecha: fechaLegible,
          valor: reading.valor_medicion,
          sensor: sensor.nombre_sensor,
        });
      }
    });
    console.log("Datos agrupados para gráficos:", groupedData); // Depuración
    setChartsData(groupedData);
  }, [sensorData, sensors]);

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  return (
    <div
      className="p-6 min-h-screen"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1500595046743-ee5a024c7ac8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="grid grid-cols-2 gap-4 mb-6">
        {sensorDisplayData.map((sensor) => (
          <Link
            to={`/historical/${sensor.id}`}
            key={sensor.id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col items-center cursor-pointer hover:bg-gray-100 transition-colors duration-200"
          >
            <span className="text-3xl mb-1">{sensor.icon}</span>
            <h3 className="text-sm font-semibold text-gray-800">{sensor.nombre}</h3>
            <p className="text-lg font-bold text-blue-700">{sensor.valor}</p>
          </Link>
        ))}
      </div>

      <div className="bg-white shadow-md rounded-2xl p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Gráficos de Sensores</h2>
        {Object.keys(chartsData).length > 0 ? (
          <Carousel>
            <CarouselContent>
              {Object.keys(chartsData).map((sensorId) => (
                <CarouselItem key={sensorId}>
                  <h3 className="text-lg font-semibold text-center mb-4">
                    {getSensorName(Number(sensorId))}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartsData[Number(sensorId)] || []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="fecha" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="valor" stroke="#8884d8" />
                    </LineChart>
                  </ResponsiveContainer>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500">No hay datos para mostrar gráficos</p>
        )}
      </div>
    </div>
  );
};

const HistoricalDataPage = () => {
  const { sensorData, sensors } = useMide();
  const { sensorId } = useParams();
  const selectedSensor = Number(sensorId);
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(true);
  const itemsPerPage = 4;
  const maxPages = 3;
  const maxItems = itemsPerPage * maxPages;
  const navigate = useNavigate();

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  useEffect(() => {
    if (!sensors?.length || !sensorData?.length || !selectedSensor) {
      setChartsData([]);
      return;
    }

    const chartData = sensorData
      .filter((reading) => reading.fk_id_sensor === selectedSensor)
      .map((reading) => ({
        fecha: new Date(reading.fecha_medicion).toLocaleTimeString(),
        valor: reading.valor_medicion,
      }));
    setChartsData(chartData);
  }, [sensorData, sensors, selectedSensor]);

  useEffect(() => {
    if (!sensorData?.length || !selectedSensor || !selectedDate) {
      setFilteredData([]);
      setCurrentPage(1);
      return;
    }

    const filterData = () => {
      const filtered = sensorData
        .filter((reading) => reading.fk_id_sensor === selectedSensor)
        .filter((reading) => {
          const readingDate = new Date(reading.fecha_medicion);
          if (isNaN(readingDate.getTime())) return false;
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
        })
        .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime())
        .slice(0, maxItems)
        .map((reading) => ({
          fecha: new Date(reading.fecha_medicion).toLocaleString(),
          valor: reading.valor_medicion,
        }));

      setFilteredData(filtered);
      setCurrentPage(1);
    };

    filterData();
  }, [sensorData, selectedSensor, filterType, selectedDate]);

  const totalPages = Math.min(Math.ceil(filteredData.length / itemsPerPage), maxPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="flex flex-col space-y-6 pb-20">
        <div>
          <Button
            onClick={() => navigate("/principal")}
            className="bg-gray-600 text-white flex items-center space-x-2"
          >
            <span>⬅</span>
            <span>Regresar</span>
          </Button>
        </div>

        <h1 className="text-2xl font-bold text-gray-800">
          Datos Históricos de {getSensorName(selectedSensor)}
        </h1>

        <div>
          <Button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-blue-600 text-white mb-4"
          >
            {showFilters ? "Ocultar Filtros" : "Mostrar Filtros"}
          </Button>
          {showFilters && (
            <div className="flex space-x-4">
              <Select onValueChange={(value) => setFilterType(value as "day" | "week" | "month" | "year")}>
                <SelectTrigger className="w-[150px]">
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
                className="rounded-md border"
              />
            </div>
          )}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📋 Datos Históricos</h2>
          {filteredData.length > 0 ? (
            <div>
              <div className="overflow-x-auto">
                <table className="min-w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="border-b p-4 text-left text-gray-700">Fecha</th>
                      <th className="border-b p-4 text-left text-gray-700">Valor</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedData.map((data, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">{data.fecha}</td>
                        <td className="p-4">{data.valor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <Button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="bg-gray-600 text-white"
                >
                  Anterior
                </Button>
                <p className="text-gray-600">
                  Página {currentPage} de {totalPages}
                </p>
                <Button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="bg-gray-600 text-white"
                >
                  Siguiente
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos disponibles para los filtros seleccionados.</p>
          )}
        </div>

        <div className="bg-white shadow-md rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">📊 Gráfico del Sensor</h2>
          {chartsData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#8884d8" />
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

export { HomePage, HistoricalDataPage };