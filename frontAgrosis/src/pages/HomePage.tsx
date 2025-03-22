import { useState, useEffect } from "react";
import { useMide } from "../hooks/iot/useMide";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Link } from "react-router-dom";

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: any[] }>({});
  const [selectedSensorForChart, setSelectedSensorForChart] = useState<number | null>(null);
  const [selectedSensorForHistory, setSelectedSensorForHistory] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Solo 4 filas por página
  const maxPages = 3; // Máximo 3 páginas
  const maxItems = itemsPerPage * maxPages; // Máximo 12 elementos (4 filas x 3 páginas)

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  // Para los gráficos en el carrusel
  useEffect(() => {
    console.log("📊 Sensores obtenidos:", sensors);
    console.log("📡 Datos de medición recibidos:", sensorData);

    if (!sensors || sensors.length === 0) {
      console.warn("⚠ No se recibieron datos de sensores");
      return;
    }
    if (!sensorData || sensorData.length === 0) {
      console.warn("⚠ No se recibieron datos de mediciones");
      return;
    }

    const groupedData: { [key: number]: any[] } = {};
    sensorData.forEach((reading) => {
      if (!groupedData[reading.fk_id_sensor]) {
        groupedData[reading.fk_id_sensor] = [];
      }
      const fechaLegible = new Date(reading.fecha_medicion).toLocaleTimeString();
      groupedData[reading.fk_id_sensor].push({
        fecha: fechaLegible,
        valor: reading.valor_medicion,
        sensor: getSensorName(reading.fk_id_sensor),
      });
    });
    setChartsData(groupedData);
  }, [sensorData, sensors]);

  // Para los datos históricos filtrados
  useEffect(() => {
    if (!sensorData || sensorData.length === 0 || !selectedSensorForHistory || !selectedDate) {
      setFilteredData([]);
      setCurrentPage(1); // Resetear la página al cambiar los filtros
      return;
    }

    const filterData = () => {
      const filtered = sensorData
        .filter((reading) => reading.fk_id_sensor === selectedSensorForHistory)
        .filter((reading) => {
          const readingDate = new Date(reading.fecha_medicion);
          if (isNaN(readingDate.getTime())) {
            console.error("❌ Fecha inválida:", reading.fecha_medicion);
            return false;
          }
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
        .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime()) // Ordenar por fecha descendente (más reciente primero)
        .slice(0, maxItems) // Limitar a un máximo de 12 elementos
        .map((reading) => ({
          fecha: new Date(reading.fecha_medicion).toLocaleString(),
          valor: reading.valor_medicion,
        }));

      setFilteredData(filtered);
      setCurrentPage(1); // Resetear la página al cambiar los filtros
    };

    filterData();
  }, [sensorData, selectedSensorForHistory, filterType, selectedDate]);

  // Calcular los datos a mostrar en la página actual
  const totalPages = Math.min(Math.ceil(filteredData.length / itemsPerPage), maxPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      {/* Sensores Activos */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">📡 Sensores Activos</h2>
        {sensors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => (
              <div
                key={sensor.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{sensor.nombre_sensor}</p>
                  <p className="text-green-600">Activo</p>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setSelectedSensorForChart(sensor.id)}
                    className="bg-green-600 text-white"
                  >
                    Ver Detalles
                  </Button>
                  <Button
                    onClick={() => setSelectedSensorForHistory(sensor.id)}
                    className="bg-blue-600 text-white"
                  >
                    Datos Históricos
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No hay sensores activos</p>
        )}
      </div>

      {/* Últimas Mediciones */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">🌡 Últimas Mediciones</h2>
        {sensorData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sensors.map((sensor) => {
              const latestReading = sensorData
                .filter((r) => r.fk_id_sensor === sensor.id)
                .slice(-1)[0];
              return (
                <div key={sensor.id} className="border rounded-lg p-4">
                  <p className="font-semibold">{sensor.nombre_sensor}</p>
                  <p className="text-blue-600 font-medium">
                    {latestReading?.valor_medicion ?? "--"}{" "}
                    {sensor.nombre_sensor.includes("Temperatura") ? "°C" : "%"}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {latestReading ? new Date(latestReading.fecha_medicion).toLocaleTimeString() : "--"}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-500">No hay mediciones disponibles</p>
        )}
      </div>

      {/* Gráficos en Carrusel */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">📊 Gráficos de Sensores y Mediciones</h2>
        {Object.keys(chartsData).length > 0 ? (
          <Carousel>
            <CarouselContent>
              {Object.keys(chartsData).map((sensorId) => (
                <CarouselItem key={sensorId}>
                  <h3 className="text-lg font-semibold text-center mb-4">
                    {getSensorName(Number(sensorId))}
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartsData[Number(sensorId)]}>
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

      {/* Modal para gráficos */}
      {selectedSensorForChart && (
        <Dialog open={!!selectedSensorForChart} onOpenChange={() => setSelectedSensorForChart(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Gráfico de {getSensorName(selectedSensorForChart)}</DialogTitle>
            </DialogHeader>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartsData[selectedSensorForChart] || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="valor" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal para datos históricos */}
      {selectedSensorForHistory && (
        <Dialog open={!!selectedSensorForHistory} onOpenChange={() => setSelectedSensorForHistory(null)}>
          <DialogContent className="max-w-4xl">
            <DialogHeader>
              <DialogTitle>Datos Históricos de {getSensorName(selectedSensorForHistory)}</DialogTitle>
            </DialogHeader>

            {/* Filtros */}
            <div className="flex space-x-4 mb-6">
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

            {/* Tabla de datos históricos con paginación */}
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

                {/* Controles de paginación */}
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
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

const HistoricalDataPage = () => {
  const { sensorData, sensors } = useMide();
  const [selectedSensor, setSelectedSensor] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<"day" | "week" | "month" | "year">("day");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Solo 4 filas por página
  const maxPages = 3; // Máximo 3 páginas
  const maxItems = itemsPerPage * maxPages; // Máximo 12 elementos (4 filas x 3 páginas)

  

  useEffect(() => {
    console.log("📡 Datos de medición recibidos en HistoricalDataPage:", sensorData);
    console.log("📊 Sensores obtenidos en HistoricalDataPage:", sensors);
    console.log("📅 Fecha seleccionada:", selectedDate);
    console.log("📌 Tipo de filtro:", filterType);
    console.log("📌 Sensor seleccionado:", selectedSensor);

    if (!sensorData || sensorData.length === 0 || !selectedSensor || !selectedDate) {
      console.warn("⚠ Faltan datos para filtrar:", { sensorData, selectedSensor, selectedDate });
      setFilteredData([]);
      setCurrentPage(1);
      return;
    }

    const filterData = () => {
      const filtered = sensorData
        .filter((reading) => reading.fk_id_sensor === selectedSensor)
        .filter((reading) => {
          const readingDate = new Date(reading.fecha_medicion);
          if (isNaN(readingDate.getTime())) {
            console.error("❌ Fecha inválida:", reading.fecha_medicion);
            return false;
          }
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
        .sort((a, b) => new Date(b.fecha_medicion).getTime() - new Date(a.fecha_medicion).getTime()) // Ordenar por fecha descendente (más reciente primero)
        .slice(0, maxItems) // Limitar a un máximo de 12 elementos
        .map((reading) => ({
          fecha: new Date(reading.fecha_medicion).toLocaleString(),
          valor: reading.valor_medicion,
        }));

      console.log("📊 Datos filtrados:", filtered);
      setFilteredData(filtered);
      setCurrentPage(1);
    };

    filterData();
  }, [sensorData, selectedSensor, filterType, selectedDate]);

  // Calcular los datos a mostrar en la página actual
  const totalPages = Math.min(Math.ceil(filteredData.length / itemsPerPage), maxPages);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = filteredData.slice(startIndex, endIndex);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-green-700 mb-6">Datos Históricos</h1>

      {/* Filtros */}
      <div className="flex space-x-4 mb-6">
        <Select onValueChange={(value) => setSelectedSensor(Number(value))}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Seleccionar sensor" />
          </SelectTrigger>
          <SelectContent>
            {sensors.map((sensor) => (
              <SelectItem key={sensor.id} value={sensor.id.toString()}>
                {sensor.nombre_sensor}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

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

      {/* Gráfico */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-green-700 mb-4">📊 Gráficos de Sensores y Mediciones</h2>
        {filteredData.length > 0 ? (
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={filteredData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="valor" stroke="#8884d8" />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-gray-500">No hay datos disponibles para los filtros seleccionados.</p>
        )}
      </div>

      {/* Lista de datos históricos con paginación */}
      {filteredData.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold text-green-700 mb-4">Lista de Mediciones</h2>
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

          {/* Controles de paginación */}
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
      )}
    </div>
  );
};

export { HomePage, HistoricalDataPage };