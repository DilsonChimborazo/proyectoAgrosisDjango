import { useState, useEffect, useMemo, useCallback } from "react";
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
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

// Interfaces para tipado
interface Sensor {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

interface SensorDisplayData {
  id: number;
  nombre: string;
  valor: string;
  icon: string;
}

interface ChartDataPoint {
  fecha: string;
  valor: number;
  sensor?: string;
}

interface RealTimeData {
  valor: number;
  fecha: string;
}

// Íconos para los sensores
const icons: { [key: string]: string } = {
  temperatura: "🌡",
  humedad: "💧",
  luz: "💡",
  viento: "💨",
  presion: "🌬️",
  aire: "🌫️",
  default: "📏",
};

// Función para formatear valores según el tipo de sensor
const formatSensorValue = (value: number, tipoSensor: string): string => {
  switch (tipoSensor.toLowerCase()) {
    case "temperatura": return `${value}°C`;
    case "humedad": return `${value}%`;
    case "luz": return `${value} lux`;
    case "viento": return `${value} m/s`;
    case "presion": return `${value} hPa`;
    case "calidad_aire": return `${value} ppm`;
    default: return value.toString();
  }
};

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: ChartDataPoint[] }>({});
  const [realTimeData, setRealTimeData] = useState<{ [key: number]: RealTimeData }>({});
  const [sensorDisplayData, setSensorDisplayData] = useState<SensorDisplayData[]>([]);

  // Cargar datos del localStorage
  const loadChartsDataFromStorage = useCallback(() => {
    const storedData = localStorage.getItem("chartsData");
    const ahora = new Date().getTime();
    const veinticuatroHoras = 24 * 60 * 60 * 1000;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.timestamp && ahora - parsedData.timestamp < veinticuatroHoras) {
        setChartsData(parsedData.data);
        return true;
      } else {
        localStorage.removeItem("chartsData");
      }
    }
    return false;
  }, []);

  const saveChartsDataToStorage = useCallback((data: { [key: number]: ChartDataPoint[] }) => {
    const paquete = { data, timestamp: new Date().getTime() };
    localStorage.setItem("chartsData", JSON.stringify(paquete));
  }, []);

  const loadRealTimeDataFromStorage = useCallback(() => {
    const storedData = localStorage.getItem("realTimeData");
    const ahora = new Date().getTime();
    const veinticuatroHoras = 24 * 60 * 60 * 1000;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.timestamp && ahora - parsedData.timestamp < veinticuatroHoras) {
        setRealTimeData(parsedData.data);
        return parsedData.data;
      } else {
        localStorage.removeItem("realTimeData");
      }
    }
    return null;
  }, []);

  const saveRealTimeDataToStorage = useCallback((data: { [key: number]: RealTimeData }) => {
    const paquete = { data, timestamp: new Date().getTime() };
    localStorage.setItem("realTimeData", JSON.stringify(paquete));
  }, []);

  // WebSocket para sensores
  useEffect(() => {
    const wsSensors = new WebSocket("ws://192.168.0.113:8000/ws/api/sensores/");
    wsSensors.onopen = () => console.log("✅ Conectado al WebSocket de sensores");
    wsSensors.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.id || !data?.nombre_sensor) return;

        const newSensor: Sensor = {
          id: data.id,
          nombre_sensor: data.nombre_sensor,
          tipo_sensor: data.tipo_sensor,
          unidad_medida: data.unidad_medida,
          descripcion: data.descripcion,
          medida_minima: data.medida_minima,
          medida_maxima: data.medida_maxima,
        };
        setSensorDisplayData((prev) => {
          if (prev.some((sensor) => sensor.id === newSensor.id)) return prev;
          const icon = icons[newSensor.tipo_sensor.toLowerCase()] || icons.default;
          return [...prev, { id: newSensor.id, nombre: newSensor.nombre_sensor, valor: "Esperando datos...", icon }];
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de sensores:", error);
      }
    };
    wsSensors.onclose = () => console.log("⚠ Desconectado del WebSocket de sensores");
    wsSensors.onerror = (error) => console.error("⚠ Error en WebSocket de sensores:", error);

    return () => wsSensors.close();
  }, []);

  // Inicializar sensorDisplayData
  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      setSensorDisplayData([]);
      return;
    }

    const storedRealTimeData = loadRealTimeDataFromStorage() || {};
    const initialSensorData = sensors.map((sensor) => {
      const realTimeEntry = storedRealTimeData[sensor.id];
      const valor = realTimeEntry ? formatSensorValue(realTimeEntry.valor, sensor.tipo_sensor) : "Esperando datos...";
      return {
        id: sensor.id,
        nombre: sensor.nombre_sensor,
        valor,
        icon: icons[sensor.tipo_sensor.toLowerCase()] || icons.default,
      };
    });
    setSensorDisplayData(initialSensorData);
  }, [sensors, loadRealTimeDataFromStorage]);

  // Actualizar sensorDisplayData con realTimeData
  useEffect(() => {
    if (!sensors || sensors.length === 0 || Object.keys(realTimeData).length === 0) return;

    setSensorDisplayData((prev) =>
      prev.map((sensor) => {
        const realTimeEntry = realTimeData[sensor.id];
        if (realTimeEntry) {
          const sensorInfo = sensors.find((s) => s.id === sensor.id);
          const formattedValue = sensorInfo
            ? formatSensorValue(realTimeEntry.valor, sensorInfo.tipo_sensor)
            : realTimeEntry.valor.toString();
          return { ...sensor, valor: formattedValue };
        }
        return sensor;
      })
    );
  }, [realTimeData, sensors]);

  // WebSocket para mediciones
  useEffect(() => {
    const ws = new WebSocket("ws://127.0.0.1:8000/ws/api/mide/");
    ws.onopen = () => console.log("✅ Conectado al WebSocket de mediciones");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.fk_id_sensor || !data?.valor_medicion || !data?.fecha_medicion) return;

        const sensorId = data.fk_id_sensor;
        const fechaLegible = new Date(data.fecha_medicion).toLocaleTimeString();

        setRealTimeData((prev) => {
          const newData = { ...prev, [sensorId]: { valor: data.valor_medicion, fecha: data.fecha_medicion } };
          saveRealTimeDataToStorage(newData);
          return newData;
        });

        setChartsData((prev) => {
          const newDataPoint: ChartDataPoint = { fecha: fechaLegible, valor: data.valor_medicion };
          const updatedData = [...(prev[sensorId] || []), newDataPoint].slice(-50); // Limitar a 50 puntos
          const newChartsData = { ...prev, [sensorId]: updatedData };
          saveChartsDataToStorage(newChartsData);
          return newChartsData;
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de mediciones:", error);
      }
    };
    ws.onclose = () => console.log("⚠ Desconectado del WebSocket de mediciones");
    ws.onerror = (error) => console.error("⚠ Error en WebSocket de mediciones:", error);

    return () => ws.close();
  }, [saveRealTimeDataToStorage, saveChartsDataToStorage]);

  // Agrupar datos para gráficos
  const groupedData = useMemo(() => {
    if (!sensors?.length || !sensorData?.length) return {};
    const data: { [key: number]: ChartDataPoint[] } = {};
    sensorData.forEach((reading) => {
      const sensor = sensors.find((s) => s.id === reading.fk_id_sensor);
      if (sensor) {
        if (!data[reading.fk_id_sensor]) data[reading.fk_id_sensor] = [];
        const fechaLegible = new Date(reading.fecha_medicion).toLocaleTimeString();
        data[reading.fk_id_sensor].push({
          fecha: fechaLegible,
          valor: reading.valor_medicion,
          sensor: sensor.nombre_sensor,
        });
      }
    });
    return data;
  }, [sensorData, sensors]);

  useEffect(() => {
    if (loadChartsDataFromStorage()) return;
    setChartsData(groupedData);
    saveChartsDataToStorage(groupedData);
  }, [groupedData, loadChartsDataFromStorage, saveChartsDataToStorage]);

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
            <span className="text-green-700 text-xs font-semibold px-2 py-1 rounded-full mt-1 mb-2">
              Activo
            </span>
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

export { HomePage };