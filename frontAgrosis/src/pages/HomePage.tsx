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
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Link, useNavigate } from "react-router-dom";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearSensor from "@/components/iot/sensores/CrearSensor";

// CSS para el estilo y animaciones
const styles = `
  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    margin: 0;
    padding: 0;
    font-family: Arial, sans-serif;
  }
  .dashboard-container {
    padding: 1rem;
    min-height: 100vh;
  }
  .card {
    border-radius: 1.5rem;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    margin-bottom: 1rem;
  }
  .card:hover {
    transform: translateY(-5px);
  }
  .card-temperatura {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid #F2620F 1px;
    color: white;
  }
  .card-humedad {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid #0CE86C 1px;
    color: white;
  }
  .card-iluminacion {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid #FFD801 1px;
    color: white;
  }
  .card-viento {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid #0099DD 1px;
    color: white;
  }
  .card-presion {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid rgb(118, 42, 128) 1px;
    color: white;
  }
  .card-aire {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid rgb(121, 121, 121) 1px;
    color: white;
  }
  .card-default {
    background-color: rgba(2, 19, 10, 0.42);
    border: solid rgb(241, 43, 60) 1px;
    color: white;
  }
  .card-glass {
    background: rgba(255, 255, 255, 0.8);
    backdrop-filter: blur(10px);
    border-radius: 1.5rem;
    padding: 1rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    min-height: 350px;
  }
  .grow {
    animation: grow 2s infinite ease-in-out;
  }
  @keyframes grow {
    0% { transform: scale(1); }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); }
  }
  .spin {
    animation: spin 4s linear infinite;
  }
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .particle {
    animation: float 3s infinite ease-in-out;
  }
  @keyframes float {
    0% { transform: translateY(0); opacity: 0.5; }
    50% { transform: translateY(-10px); opacity: 1; }
    100% { transform: translateY(0); opacity: 0.5; }
  }
  .fill {
    transition: height 1s ease-in-out;
  }
  .rain {
    animation: rain 1.5s infinite linear;
  }
  @keyframes rain {
    0% { transform: translateY(-10px); opacity: 1; }
    100% { transform: translateY(50px); opacity: 0; }
  }
  .measurement {
    text-align: center;
    width: 100%;
    font-size: 1.5rem;
  }
  .chart-label {
    font-size: 0.9rem;
    font-weight: 600;
    color: #4a4a4a;
    margin-bottom: 0.5rem;
  }
  .chart-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
  }
  .legend-vertical {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
  .evapo-button, .create-sensor-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 0.75rem 1.5rem;
    border-radius: 1rem;
    background: linear-gradient(135deg, #4682b4 0%, #87CEEB 100%);
    color: white;
    font-weight: 600;
    font-size: 1rem;
    cursor: pointer;
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin-bottom: 1rem;
  }
  .evapo-button:hover, .create-sensor-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 15px rgba(0, 0, 0, 0.2);
  }
  @media (max-width: 640px) {
    .dashboard-container {
      padding: 0.5rem;
    }
    .card {
      padding: 0.75rem;
      font-size: 0.9rem;
    }
    .measurement {
      font-size: 1.2rem;
    }
    .grid-cols-1, .grid-cols-2, .grid-cols-3, .grid-cols-4, .grid-cols-5 {
      grid-template-columns: 1fr;
    }
    .evapo-button, .create-sensor-button {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }
    .chart-label {
      font-size: 0.8rem;
    }
  }
  @media (min-width: 641px) and (max-width: 1024px) {
    .grid-cols-1, .grid-cols-2, .grid-cols-3, .grid-cols-4, .grid-cols-5 {
      grid-template-columns: repeat(2, 1fr);
    }
    .card {
      padding: 1rem;
    }
    .measurement {
      font-size: 1.3rem;
    }
  }
`;

// Inyectar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const wsUrl = import.meta.env.VITE_WS_URL;

interface User {
  fk_id_rol?: { rol: string };
}

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
  nombre_era: string;
  nombre_cultivo: string;
}

interface ChartDataPoint {
  fecha: string;
  valor: number;
  sensor?: string;
  nombre_era?: string;
  nombre_cultivo?: string;
}

interface RealTimeData {
  valor: number;
  fecha: string;
  nombre_era?: string;
  nombre_cultivo?: string;
}

const icons: { [key: string]: string } = {
  temperatura: "🌡️",
  humedad: "💦",
  iluminacion: "✨",
  viento: "🌪️",
  presion: "📈",
  aire: "🌬️",
  default: "⚙️",
};

const COLORS: { [key: string]: string } = {
  temperatura: "#F2620F",
  humedad: "#0CE86C",
  iluminacion: "#FFD801",
  viento: "#0099DD",
  presion: "rgb(129, 40, 141)",
  aire: "rgba(124, 124, 124, 0.85)",
  default: "rgba(238, 23, 23, 0.94)",
};

const mapSensorType = (tipoSensor: string | undefined | null): string => {
  if (!tipoSensor) {
    console.warn("tipo_sensor es undefined o null, usando 'default'");
    return "default";
  }

  const normalized = tipoSensor.toLowerCase().replace(/\s/g, '');
  if (normalized.includes("temperatura")) return "temperatura";
  if (normalized.includes("humedad")) return "humedad";
  if (normalized.includes("iluminacion")) return "iluminacion";
  if (normalized.includes("viento")) return "viento";
  if (normalized.includes("presion")) return "presion";
  if (normalized.includes("aire") || normalized.includes("calidad_aire")) return "aire";

  console.warn(`Tipo de sensor desconocido: ${tipoSensor}, usando 'default'`);
  return "default";
};

const formatSensorValue = (value: number, tipoSensor: string): string => {
  const normalizedTipo = mapSensorType(tipoSensor);
  switch (normalizedTipo) {
    case "temperatura": return `${value}°C`;
    case "humedad": return `${value}%`;
    case "iluminacion": return `${value} lux`;
    case "viento": return `${value} m/s`;
    case "presion": return `${value} hPa`;
    case "aire": return `${value} ppm`;
    default: return value.toString();
  }
};

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const offsetHours = -5;
  date.setHours(date.getHours() + offsetHours);
  return date.toLocaleString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    timeZone: 'America/Bogota',
  });
};

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: ChartDataPoint[] }>({});
  const [realTimeData, setRealTimeData] = useState<{ [key: number]: RealTimeData }>({});
  const [sensorDisplayData, setSensorDisplayData] = useState<SensorDisplayData[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const navigate = useNavigate();

  // Verificar si el usuario es administrador
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario: User | null = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  useEffect(() => {
    console.log("Datos de sensores recibidos:", sensors);
  }, [sensors]);

  const loadChartsData = useCallback(() => {
    const storedData = localStorage.getItem("chartsData");
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.timestamp && now - parsedData.timestamp < oneDay) {
        setChartsData(parsedData.data);
        return true;
      } else {
        localStorage.removeItem("chartsData");
      }
    }
    return false;
  }, []);

  const saveChartsData = useCallback((data: { [key: number]: ChartDataPoint[] }) => {
    localStorage.setItem("chartsData", JSON.stringify({ data, timestamp: new Date().getTime() }));
  }, []);

  const loadRealTimeData = useCallback(() => {
    const storedData = localStorage.getItem("realTimeData");
    const now = new Date().getTime();
    const oneDay = 24 * 60 * 60 * 1000;

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      if (parsedData.timestamp && now - parsedData.timestamp < oneDay) {
        setRealTimeData(parsedData.data);
        return parsedData.data;
      } else {
        localStorage.removeItem("realTimeData");
      }
    }
    return null;
  }, []);

  const saveRealTimeData = useCallback((data: { [key: number]: RealTimeData }) => {
    localStorage.setItem("realTimeData", JSON.stringify({ data, timestamp: new Date().getTime() }));
  }, []);

  useEffect(() => {
    const wsSensors = new WebSocket(`${wsUrl}sensores/`);
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
          const tipoSensor = mapSensorType(newSensor.tipo_sensor);
          const icon = icons[tipoSensor] || icons.default;
          return [...prev, { id: newSensor.id, nombre: newSensor.nombre_sensor, valor: "Esperando datos...", icon, nombre_era: "Sin Era", nombre_cultivo: "Sin Cultivo" }];
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de sensores:", error);
      }
    };
    wsSensors.onclose = () => console.log("⚠ Desconectado del WebSocket de sensores");
    return () => wsSensors.close();
  }, []);

  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      setSensorDisplayData([]);
      return;
    }

    const storedRealTimeData = loadRealTimeData() || {};
    const initialSensorData = sensors.map((sensor) => {
      const realTimeEntry = storedRealTimeData[sensor.id];
      const valor = realTimeEntry ? formatSensorValue(realTimeEntry.valor, sensor.tipo_sensor) : "Esperando datos...";
      const tipoSensor = mapSensorType(sensor.tipo_sensor);
      const icon = icons[tipoSensor] || icons.default;
      return {
        id: sensor.id,
        nombre: sensor.nombre_sensor,
        valor,
        icon,
        nombre_era: realTimeEntry?.nombre_era || "Sin Era",
        nombre_cultivo: realTimeEntry?.nombre_cultivo || "Sin Cultivo",
      };
    });
    setSensorDisplayData(initialSensorData);
  }, [sensors, loadRealTimeData]);

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
          return { ...sensor, valor: formattedValue, nombre_era: realTimeEntry.nombre_era || "Sin Era", nombre_cultivo: realTimeEntry.nombre_cultivo || "Sin Cultivo" };
        }
        return sensor;
      })
    );
  }, [realTimeData, sensors]);

  useEffect(() => {
    const ws = new WebSocket(`${wsUrl}mide/`);
    ws.onopen = () => console.log("✅ Conectado al WebSocket de mediciones");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.fk_id_sensor || !data?.valor_medicion || !data?.fecha_medicion || !data?.fk_id_plantacion) return;

        const sensorId = data.fk_id_sensor;
        const horaRecibida = data.fecha_medicion;

        setRealTimeData((prev) => {
          const newData = {
            ...prev,
            [sensorId]: {
              valor: data.valor_medicion,
              fecha: horaRecibida,
              nombre_era: data.nombre_era || "Sin Era",
              nombre_cultivo: data.nombre_cultivo || "Sin Cultivo",
            },
          };
          saveRealTimeData(newData);
          console.log("Datos en tiempo real actualizados:", newData);
          return newData;
        });

        setChartsData((prev) => {
          const newDataPoint: ChartDataPoint = {
            fecha: formatDateTime(horaRecibida),
            valor: data.valor_medicion,
            sensor: getSensorName(sensorId),
            nombre_era: data.nombre_era || "Sin Era",
            nombre_cultivo: data.nombre_cultivo || "Sin Cultivo",
          };
          const updatedData = [...(prev[sensorId] || []), newDataPoint].slice(-50);
          const newChartsData = { ...prev, [sensorId]: updatedData };
          saveChartsData(newChartsData);
          return newChartsData;
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de mediciones:", error);
      }
    };
    ws.onclose = () => console.log("⚠ Desconectado del WebSocket de mediciones");
    return () => ws.close();
  }, [saveRealTimeData, saveChartsData]);

  const groupedData = useMemo(() => {
    if (!sensors?.length || !sensorData?.length) return {};
    const data: { [key: number]: ChartDataPoint[] } = {};
    sensorData.forEach((reading) => {
      const sensor = sensors.find((s) => s.id === reading.fk_id_sensor);
      if (sensor) {
        if (!data[reading.fk_id_sensor]) data[reading.fk_id_sensor] = [];
        data[reading.fk_id_sensor].push({
          fecha: formatDateTime(reading.fecha_medicion),
          valor: reading.valor_medicion,
          sensor: sensor.nombre_sensor,
          nombre_era: reading.nombre_era,
          nombre_cultivo: reading.nombre_cultivo,
        });
      }
    });
    return data;
  }, [sensorData, sensors]);

  useEffect(() => {
    if (loadChartsData()) return;
    setChartsData(groupedData);
    saveChartsData(groupedData);
  }, [groupedData, loadChartsData, saveChartsData]);

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Sensor Desconocido";
  };

  const getChartData = (sensorId: number) => {
    const sensorInfo = sensors.find((s) => s.id === sensorId);
    const realTimeEntry = realTimeData[sensorId];
    if (!sensorInfo || !realTimeEntry) return null;

    const value = realTimeEntry.valor;
    const min = sensorInfo.medida_minima || 0;
    const max = sensorInfo.medida_maxima || 100;
    const normalizedValue = Math.min(100, Math.max(0, ((value - min) / (max - min)) * 100));

    return { normalizedValue, value };
  };

  const latestSensorValues = useMemo(() => {
    if (!sensors || sensors.length === 0 || !realTimeData) {
      console.log("No hay sensores o datos en tiempo real disponibles");
      return [];
    }

    const values = sensors
      .map((sensor) => {
        const realTimeEntry = realTimeData[sensor.id];
        if (!realTimeEntry) return null;

        const formattedValue = formatSensorValue(realTimeEntry.valor, sensor.tipo_sensor);
        const tipoSensor = mapSensorType(sensor.tipo_sensor);
        return {
          formattedValue,
          value: realTimeEntry.valor,
          name: `${sensor.nombre_sensor} (${realTimeEntry.nombre_cultivo} - ${realTimeEntry.nombre_era})`,
          tipo: tipoSensor,
        };
      })
      .filter((entry) => entry !== null && entry.value !== 0);

    console.log("Datos para el gráfico de dona (latestSensorValues):", values);
    return values;
  }, [sensors, realTimeData]);

  const getLineColor = (sensorId: number) => {
    const sensorInfo = sensors.find((s) => s.id === sensorId);
    const tipoSensor = mapSensorType(sensorInfo?.tipo_sensor);
    return COLORS[tipoSensor] || COLORS.default;
  };

  const getPieColor = (entry: any, index: number) => {
    const sensor = sensors.find((s) => s.nombre_sensor === entry.name.split(" (")[0]);
    const tipoSensor = sensor ? mapSensorType(sensor.tipo_sensor) : "default";
    return COLORS[tipoSensor] || COLORS.default;
  };

  const handleEvapoClick = () => {
    navigate('/iot/evapotranspiracion');
  };

  const openCreateModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    closeModal();
  };

  return (
    <div className="dashboard-container">
      <div className="flex flex-col sm:flex-row justify-start items-center gap-4 mb-4">
        <button className="evapo-button" onClick={handleEvapoClick}>
          Ver Evapotranspiración
        </button>
        {esAdministrador && (
          <button className="create-sensor-button" onClick={openCreateModal}>
            Crear Sensor
          </button>
        )}
      </div>

      {esAdministrador && isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Crear Nuevo Sensor"
          contenido={<CrearSensor onSuccess={handleSuccess} />}
          size="md"
        />
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {sensorDisplayData.map((sensor) => {
          const chartData = getChartData(sensor.id);
          const sensorInfo = sensors.find((s) => s.id === sensor.id);
          const tipoSensor = mapSensorType(sensorInfo?.tipo_sensor);
          const cardClass = `card-${tipoSensor}`;

          console.log(`Sensor: ${sensor.nombre}, tipo_sensor: ${sensorInfo?.tipo_sensor}, tipoSensor mapeado: ${tipoSensor}, clase asignada: ${cardClass}`);

          if (!chartData) {
            return (
              <Link
                to={`/historical/${sensor.id}`}
                key={sensor.id}
                className={`card ${cardClass} flex flex-col items-start cursor-pointer transition-colors duration-200`}
              >
                <div className="flex flex-col items-center w-full mb-2">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-semibold ms-11">{sensor.nombre}</h3>
                    <span className="text-2xl">{sensor.icon}</span>
                  </div>
                  <span className="text-[0.65rem] font-semibold bg-white bg-opacity-20 p-0 m-0 rounded-[0.330rem] inline-block leading-[0.65rem] w-fit">
                    Activo
                  </span>
                </div>
                <p className="text-sm text-center w-full">{sensor.nombre_cultivo} - {sensor.nombre_era}</p>
                <p className="text-2xl font-bold mb-3 measurement">{sensor.valor}</p>
                <div className="w-full h-20">
                  <p className="text-xs text-center">Esperando datos...</p>
                </div>
              </Link>
            );
          }

          return (
            <Link
              to={`/historical/${sensor.id}`}
              key={sensor.id}
              className={`card ${cardClass} flex flex-col items-start cursor-pointer transition-colors duration-200`}
            >
              <div className="flex flex-col items-center w-full mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{sensor.icon}</span>
                  <h3 className="text-sm font-semibold">{sensor.nombre}</h3>
                </div>
                <span className="text-[0.65rem] font-semibold bg-white bg-opacity-20 p-0 m-0 rounded-[0.325rem] inline-block leading-[0.65rem] w-fit">
                  Activo
                </span>
              </div>
              <p className="text-sm text-center w-full">{sensor.nombre_cultivo} - {sensor.nombre_era}</p>
              <p className="text-2xl font-bold mb-3 measurement">{sensor.valor}</p>

              <div className="w-full h-20 flex justify-center relative">
                {tipoSensor === "temperatura" && (
                  <svg width="40" height="80" viewBox="0 0 40 80">
                    <rect x="15" y="10" width="10" height="60" fill="#E5E7EB" rx="5" />
                    <rect
                      x="15"
                      y={71 - (chartData.normalizedValue * 0.6)}
                      width="10"
                      height={chartData.normalizedValue * 0.6}
                      fill={COLORS.temperatura}
                      className="fill"
                      rx="5"
                    />
                    <circle cx="20" cy="70" r="5" fill={COLORS.temperatura} />
                    <title>{`${chartData.value}°C`}</title>
                  </svg>
                )}

                {tipoSensor === "humedad" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="25" fill={COLORS.humedad} opacity="0.3" />
                    {[...Array(5)].map((_, i) => (
                      <line
                        key={i}
                        x1={30 + i * 5 - 10}
                        y1="10"
                        x2={30 + i * 5 - 10}
                        y2="20"
                        stroke={COLORS.humedad}
                        strokeWidth="2"
                        className="rain"
                        style={{ animationDelay: `${i * 0.3}s` }}
                      />
                    ))}
                    <circle
                      cx="30"
                      cy="30"
                      r={15 + (chartData.normalizedValue * 0.1)}
                      fill="none"
                      stroke={COLORS.humedad}
                      strokeWidth="3"
                    />
                    <title>{`${chartData.value}%`}</title>
                  </svg>
                )}

                {tipoSensor === "iluminacion" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <text x="30" y="15" fontSize="15" textAnchor="middle">{sensor.icon}</text>
                    <circle cx="30" cy="30" r="15" fill={COLORS.iluminacion} />
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={i}
                        x1="30"
                        y1="30"
                        x2="30"
                        y2={15 - (chartData.normalizedValue * 0.1)}
                        stroke={COLORS.iluminacion}
                        strokeWidth="2"
                        transform={`rotate(${i * 45} 30 30)`}
                        className="grow"
                      />
                    ))}
                    <title>{`${chartData.value} lux`}</title>
                  </svg>
                )}

                {tipoSensor === "viento" && (
                  <svg width="60" height="60" viewBox="0 0 60 60" className="spin">
                    <text x="30" y="15" fontSize="15" textAnchor="middle">{sensor.icon}</text>
                    {[...Array(4)].map((_, i) => (
                      <line
                        key={i}
                        x1="30"
                        y1="30"
                        x2="30"
                        y2={15 + (chartData.normalizedValue * 0.15)}
                        stroke={COLORS.viento}
                        strokeWidth="4"
                        transform={`rotate(${i * 90} 30 30)`}
                      />
                    ))}
                    <circle cx="30" cy="30" r="5" fill={COLORS.viento} />
                    <title>{`${chartData.value} m/s`}</title>
                  </svg>
                )}

                {tipoSensor === "presion" && (
                  <svg width="60" height="80" viewBox="0 0 60 80">
                    <rect x="20" y="10" width="20" height="60" fill="#E5E7EB" rx="5" />
                    <line
                      x1="20"
                      y1={70 - (chartData.normalizedValue * 0.6)}
                      x2="40"
                      y2={70 - (chartData.normalizedValue * 0.6)}
                      stroke={COLORS.presion}
                      strokeWidth="2"
                      className="fill"
                    />
                    <title>{`${chartData.value} hPa`}</title>
                  </svg>
                )}

                {tipoSensor === "aire" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="20" fill={COLORS.aire} opacity="0.3" />
                    {[...Array(5)].map((_, i) => (
                      <circle
                        key={i}
                        cx={30 + Math.cos(i * 1.2) * 15}
                        cy={30 + Math.sin(i * 1.2) * 15}
                        r={3 + (chartData.normalizedValue * 0.05)}
                        fill={COLORS.aire}
                        className="particle"
                        style={{ animationDelay: `${i * 0.2}s` }}
                      />
                    ))}
                    <title>{`${chartData.value} ppm`}</title>
                  </svg>
                )}

                {tipoSensor !== "temperatura" && tipoSensor !== "humedad" && tipoSensor !== "iluminacion" && tipoSensor !== "viento" && tipoSensor !== "presion" && tipoSensor !== "aire" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <circle
                      cx="30"
                      cy="50"
                      r="20"
                      fill="none"
                      stroke={COLORS[tipoSensor] || COLORS.default}
                      strokeWidth="4"
                      strokeDasharray={`${(chartData.normalizedValue * 125.6) / 100}, 125.6`}
                      transform="rotate(-90 30 30)"
                    />
                    <title>{`${chartData.value}`}</title>
                  </svg>
                )}
              </div>
            </Link>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="card-glass lg:col-span-2">
          <div className="flex justify-between items-center text-green-700 mb-4">
            <h2 className="chart-label">GRAFICO DE LOS SENSORES</h2>
          </div>
          {Object.keys(chartsData).length > 0 ? (
            <Carousel>
              <CarouselContent>
                {Object.keys(chartsData).map((sensorId) => (
                  <CarouselItem key={sensorId}>
                    <h3 className="text-lg font-semibold text-center mb-4">
                      {getSensorName(Number(sensorId))} ({chartsData[Number(sensorId)][0]?.nombre_cultivo} - {chartsData[Number(sensorId)][0]?.nombre_era})
                    </h3>
                    <ResponsiveContainer width="100%" height={200}>
                      <LineChart data={chartsData[Number(sensorId)] || []}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis
                          dataKey="fecha"
                          label={{ value: 'Tiempo', position: 'insideBottomRight', offset: -5 }}
                          tick={{ fontSize: 12 }}
                        />
                        <YAxis
                          label={{ value: 'Valor', angle: -90, position: 'insideLeft' }}
                          tick={{ fontSize: 12 }}
                        />
                        <Tooltip
                          formatter={(value: number) => [value, getSensorName(Number(sensorId))]}
                          labelFormatter={(label) => `Fecha: ${label}`}
                        />
                        <Line
                          type="monotone"
                          dataKey="valor"
                          stroke={getLineColor(Number(sensorId))}
                          strokeWidth="2"
                          dot={{ r: 4, fill: getLineColor(Number(sensorId)) }}
                          activeDot={{ r: 6 }}
                        />
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

        <div className="card-glass text-left" style={{ maxWidth: '550px', margin: '0 auto' }}>
          <h2 className="chart-label">ÚLTIMOS VALORES DE SENSORES</h2>
          {latestSensorValues.length > 0 ? (
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={latestSensorValues}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={80}
                    label={({ value }) => `${value}`}
                    labelLine={false}
                  >
                    {latestSensorValues.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={getPieColor(entry, index)}
                      />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div style={{
                fontSize: '0.75rem',
                paddingTop: '10px',
                width: '100%',
                textAlign: 'center',
                color: '#4a4a4a',
                lineHeight: '1.2'
              }}>
                {latestSensorValues.map((entry, index) => (
                  <div key={index} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '5px 0' }}>
                    <span
                      style={{
                        display: 'inline-block',
                        width: '10px',
                        height: '10px',
                        backgroundColor: getPieColor(entry, index),
                        marginRight: '5px',
                      }}
                    />
                    <span className="text-left">{entry.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-500">No hay datos disponibles para los sensores</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { HomePage };