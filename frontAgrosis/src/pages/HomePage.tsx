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
import { Link } from "react-router-dom";

// Íconos para los sensores
const icons: { [key: string]: string } = {
  temperatura: "🌡",
  humedad: "💧",
  luz: "💡",
  viento: "💨",
  presion: "🌬️",
  aire: "🌫️", // Añadimos un ícono para el sensor de calidad del aire
  default: "📏",
};

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: any[] }>({});
  const [realTimeData, setRealTimeData] = useState<{ [key: number]: { valor: number; fecha: string } }>({});
  const [sensorDisplayData, setSensorDisplayData] = useState<any[]>([]);

  // WebSocket para recibir nuevos sensores
  useEffect(() => {
    const wsSensors = new WebSocket("ws://192.168.100.115:8000/ws/api/sensores/");

    wsSensors.onopen = () => {
      console.log("✅ Conectado al WebSocket de sensores");
    };

    wsSensors.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Nuevo sensor recibido del WebSocket:", data);

        if (data.id && data.nombre_sensor) {
          const newSensor = {
            id: data.id,
            nombre_sensor: data.nombre_sensor,
            tipo_sensor: data.tipo_sensor,
            unidad_medida: data.unidad_medida,
            descripcion: data.descripcion,
            medida_minima: data.medida_minima,
            medida_maxima: data.medida_maxima,
          };

          setSensorDisplayData((prev) => {
            if (prev.some((sensor) => sensor.id === newSensor.id)) {
              console.log(`Sensor ${newSensor.nombre_sensor} ya existe en sensorDisplayData`);
              return prev;
            }

            const icon = icons[newSensor.tipo_sensor.toLowerCase()] || icons.default;
            console.log(`Añadiendo sensor ${newSensor.nombre_sensor} con ícono ${icon}`);
            return [
              ...prev,
              {
                id: newSensor.id,
                nombre: newSensor.nombre_sensor,
                valor: "Esperando datos...",
                icon,
              },
            ];
          });
        }
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de sensores:", error);
      }
    };

    wsSensors.onclose = () => {
      console.log("⚠ Desconectado del WebSocket de sensores");
    };

    wsSensors.onerror = (error) => {
      console.error("⚠ Error en WebSocket de sensores:", error);
    };

    return () => {
      wsSensors.close();
    };
  }, []);

  // Cargar los sensores iniciales desde el backend
  useEffect(() => {
    if (!sensors || sensors.length === 0) {
      console.warn("⚠ No se recibieron sensores del backend");
      setSensorDisplayData([]);
      return;
    }

    console.log("Sensores recibidos:", sensors);

    const initialSensorData = sensors.map((sensor) => {
      const icon = icons[sensor.tipo_sensor.toLowerCase()] || icons.default;
      console.log(`Cargando sensor ${sensor.nombre_sensor} con ícono ${icon}`);
      return {
        id: sensor.id,
        nombre: sensor.nombre_sensor,
        valor: "Esperando datos...",
        icon,
      };
    });

    console.log("Datos iniciales de sensores:", initialSensorData);
    setSensorDisplayData(initialSensorData);
  }, [sensors]);

  // Conexión al WebSocket de mediciones
  useEffect(() => {
    const ws = new WebSocket("ws://192.168.100.115:8000/ws/api/mide/");

    ws.onopen = () => {
      console.log("✅ Conectado al WebSocket de mediciones");
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📡 Datos recibidos del WebSocket de mediciones:", data);

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
              const sensorInfo = sensors.find((s) => s.id === sensor.id);
              if (sensorInfo) {
                if (sensorInfo.tipo_sensor.toLowerCase() === "temperatura") {
                  formattedValue = `${data.valor_medicion}°C`;
                } else if (sensorInfo.tipo_sensor.toLowerCase() === "humedad") {
                  formattedValue = `${data.valor_medicion}%`;
                } else if (sensorInfo.tipo_sensor.toLowerCase() === "luz") {
                  formattedValue = `${data.valor_medicion} lux`;
                } else if (sensorInfo.tipo_sensor.toLowerCase() === "viento") {
                  formattedValue = `${data.valor_medicion} m/s`;
                } else if (sensorInfo.tipo_sensor.toLowerCase() === "presion") {
                  formattedValue = `${data.valor_medicion} hPa`;
                } else if (sensorInfo.tipo_sensor.toLowerCase() === "calidad_aire") {
                  formattedValue = `${data.valor_medicion} ppm`; // Formato para sensor de calidad del aire (CO2)
                }
              }
              console.log(`Actualizando sensor ${sensor.nombre} con valor ${formattedValue}`);
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

          const updatedData = [...(prev[sensorId] || []), newDataPoint];
          if (updatedData.length > 50) updatedData.shift();
          return { ...prev, [sensorId]: updatedData };
        });
      } catch (error) {
        console.error("⚠ Error al procesar datos del WebSocket de mediciones:", error);
      }
    };

    ws.onclose = () => {
      console.log("⚠ Desconectado del WebSocket de mediciones");
    };

    ws.onerror = (error) => {
      console.error("⚠ Error en WebSocket de mediciones:", error);
    };

    return () => {
      ws.close();
    };
  }, [sensors]);

  // Preparar datos iniciales para gráficos
  useEffect(() => {
    if (!sensors?.length || !sensorData?.length) {
      console.warn("⚠ No se recibieron datos de sensores o mediciones");
      return;
    }

    const groupedData: { [key: number]: any[] } = {};
    sensorData.forEach((reading) => {
      const sensor = sensors.find((s) => s.id === reading.fk_id_sensor);
      if (sensor) {
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
    console.log("Datos agrupados para gráficos:", groupedData);
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
            <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full mt-1 mb-2">
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