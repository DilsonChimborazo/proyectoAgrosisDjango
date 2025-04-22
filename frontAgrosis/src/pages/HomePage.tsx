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
  Legend,
} from "recharts";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { Link } from "react-router-dom";

// CSS para el estilo y animaciones
const styles = `
  body {
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    margin: 0;
    padding: 0;
  }
  .dashboard-container {
    padding: 2rem;
    min-height: 100vh;
  }
  .card {
    border-radius: 1.5rem;
    padding: 1.5rem;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
  }
  .card:hover {
    transform: translateY(-5px);
  }
  .card-orange {
    background: linear-gradient(135deg, #ff8c00 0%, #ff4500 100%); /* Más naranja */
    color: white;
  }
  .card-blue {
    background: linear-gradient(135deg, #1e90ff 0%, #00b7eb 100%); /* Más azul */
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
`;

// Inyectar los estilos en el documento
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

const wsUrl = import.meta.env.VITE_WS_URL;

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

const icons: { [key: string]: string } = {
  temperatura: "🌡️",
  humedad: "💦",
  luz: "✨",
  viento: "🌪️",
  presion: "📈",
  aire: "🌬️",
  default: "⚙️",
};

const COLORS: { [key: string]: string } = {
  temperatura: "#FF4500",
  humedad: "#1E90FF",
  luz: "#FFD700",
  viento: "#4682B4",
  presion: "#8A2BE2",
  aire: "#32CD32",
  default: "#808080",
};

const DONUT_COLORS = ["#1e90ff", "#ff8c00", "#00b7eb", "#ff4500", "#87cefa"]; // Más azul y naranja

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

const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);
  const offsetHours = -5; // UTC-5
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

  // WebSocket para sensores
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
          const icon = icons[newSensor.tipo_sensor.toLowerCase()] || icons.default;
          return [...prev, { id: newSensor.id, nombre: newSensor.nombre_sensor, valor: "Esperando datos...", icon }];
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de sensores:", error);
      }
    };
    wsSensors.onclose = () => console.log("⚠ Desconectado del WebSocket de sensores");
    return () => wsSensors.close();
  }, []);

  // Inicializar sensorDisplayData
  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      setSensorDisplayData([]);
      return;
    }

    const storedRealTimeData = loadRealTimeData() || {};
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
  }, [sensors, loadRealTimeData]);

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
    const ws = new WebSocket(`${wsUrl}mide/`);
    ws.onopen = () => console.log("✅ Conectado al WebSocket de mediciones");
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (!data?.fk_id_sensor || !data?.valor_medicion || !data?.fecha_medicion) return;

        const sensorId = data.fk_id_sensor;
        const horaRecibida = data.fecha_medicion;

        setRealTimeData((prev) => {
          const newData = { 
            ...prev, 
            [sensorId]: { 
              valor: data.valor_medicion, 
              fecha: horaRecibida 
            } 
          };
          saveRealTimeData(newData);
          console.log("Datos en tiempo real actualizados:", newData);
          return newData;
        });

        setChartsData((prev) => {
          const newDataPoint: ChartDataPoint = { 
            fecha: formatDateTime(horaRecibida),
            valor: data.valor_medicion 
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

  // Agrupar datos para gráficos
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

  // Preparar datos para el gráfico de dona (últimos valores de sensores)
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
        return {
          formattedValue,
          value: realTimeEntry.valor,
          name: sensor.nombre_sensor,
        };
      })
      .filter((entry) => entry !== null && entry.value !== 0);

    console.log("Datos para el gráfico de dona (latestSensorValues):", values);
    return values;
  }, [sensors, realTimeData]);

  // Determinar el color de la línea según el índice del sensor
  const getLineColor = (sensorId: number) => {
    const sensorIndex = sensorDisplayData.findIndex((sensor) => sensor.id === sensorId);
    return sensorIndex % 2 === 0 ? "#1e90ff" : "#ff8c00"; // Azul o naranja según el índice
  };

  return (
    <div className="p-5">
      {/* Tarjetas de Sensores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        {sensorDisplayData.map((sensor, index) => {
          const chartData = getChartData(sensor.id);
          const sensorInfo = sensors.find((s) => s.id === sensor.id);
          const tipoSensor = sensorInfo?.tipo_sensor.toLowerCase() || "default";

          // Alternar entre azul y naranja
          const cardClass = index % 2 === 0 ? "card-blue" : "card-orange";

          if (!chartData) {
            return (
              <Link
                to={`/historical/${sensor.id}`}
                key={sensor.id}
                className={`card ${cardClass} flex flex-col items-start cursor-pointer transition-colors duration-200`}
              >
                <div className="flex items-center justify-between w-full mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl">{sensor.icon}</span>
                    <h3 className="text-sm font-semibold">{sensor.nombre}</h3>
                  </div>
                  <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded-full">
                    Activo
                  </span>
                </div>
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
              <div className="flex items-center justify-between w-full mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{sensor.icon}</span>
                  <h3 className="text-sm font-semibold">{sensor.nombre}</h3>
                </div>
                <span className="text-xs font-semibold bg-white bg-opacity-20 px-2 py-1 rounded-full">
                  Activo
                </span>
              </div>

              <p className="text-2xl font-bold mb-3 measurement">{sensor.valor}</p>

              <div className="w-full h-20 flex justify-center relative">
                {tipoSensor === "temperatura" && (
                  <svg width="40" height="80" viewBox="0 0 40 80">
                    <rect x="15" y="10" width="10" height="60" fill="#E5E7EB" rx="5" />
                    <rect
                      x="15"
                      y={70 - (chartData.normalizedValue * 0.6)}
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

                {tipoSensor === "luz" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <text x="30" y="15" fontSize="15" textAnchor="middle">{sensor.icon}</text>
                    <circle cx="30" cy="30" r="15" fill={COLORS.luz} />
                    {[...Array(8)].map((_, i) => (
                      <line
                        key={i}
                        x1="30"
                        y1="30"
                        x2="30"
                        y2={15 - (chartData.normalizedValue * 0.1)}
                        stroke={COLORS.luz}
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

                {tipoSensor === "default" && (
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle cx="30" cy="30" r="20" fill="none" stroke="#E5E7EB" strokeWidth="4" />
                    <circle
                      cx="30"
                      cy="30"
                      r="20"
                      fill="none"
                      stroke={COLORS.default}
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
      {/* Sección de Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Gráfico de Líneas (Valores de Sensores a lo Largo del Tiempo) */}
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
                      {getSensorName(Number(sensorId))}
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
                          stroke={getLineColor(Number(sensorId))} // Color dinámico según el sensor
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

        {/* Gráfico de Dona (Últimos Valores de Sensores) */}
        <div className="card-glass">
          <h2 className="chart-label">ÚLTIMOS VALORES DE SENSORES</h2>
          {latestSensorValues.length > 0 ? (
            <ResponsiveContainer width="100%" height={350}>
              <PieChart>
                <Pie
                  data={latestSensorValues}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={60} // Esto crea el efecto de dona
                  outerRadius={120}
                  fill="#8884d8"
                  label={({ value }) => `${value}`} // Mostrar solo el valor en las etiquetas
                >
                  {latestSensorValues.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={DONUT_COLORS[index % DONUT_COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value}`, name]} />
                <Legend
                  layout="vertical"
                  align="center"
                  verticalAlign="bottom"
                  wrapperStyle={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500">No hay datos disponibles para los sensores</p>
          )}
        </div>
      </div>
    </div>
  );
};

export { HomePage };