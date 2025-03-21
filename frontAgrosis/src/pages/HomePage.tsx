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

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [chartsData, setChartsData] = useState<{ [key: number]: any[] }>({});

  const getSensorName = (sensorId: number) => {
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Desconocido";
  };

  useEffect(() => {
    console.log("📊 Sensores obtenidos:", sensors);
    console.log("📡 Datos de medición recibidos:", sensorData);

    if (!sensors || sensors.length === 0) {
      console.warn("⚠ No se recibieron datos de sensores");
    }
    if (!sensorData || sensorData.length === 0) {
      console.warn("⚠ No se recibieron datos de mediciones");
      return;
    }

    // 📌 Agrupar datos por sensor
    const groupedData: { [key: number]: any[] } = {};
    sensorData.forEach((reading) => {
      if (!groupedData[reading.fk_id_sensor]) {
        groupedData[reading.fk_id_sensor] = [];
      }

      let fechaLegible;
      try {
        fechaLegible = new Date(reading.fecha_medicion).toLocaleTimeString();
      } catch (error) {
        console.error("❌ Error convirtiendo fecha:", error, "Valor recibido:", reading.fecha_medicion);
        fechaLegible = "Fecha Inválida";
      }

      groupedData[reading.fk_id_sensor].push({
        fecha: fechaLegible,
        valor: reading.valor_medicion,
        sensor: getSensorName(reading.fk_id_sensor),
      });
    });

    console.log("📊 Datos agrupados para gráficos:", groupedData);
    setChartsData(groupedData);
  }, [sensorData, sensors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* 📡 Sensores Activos */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-semibold text-green-700">📡 Sensores Activos</h2>
        <ul className="text-gray-600">
          {sensorData.length > 0 ? (
            [...new Set(sensorData.map((r) => r.fk_id_sensor))].map((sensorId) => (
              <li key={sensorId} className="border-b py-2">
                <strong>Sensor: {getSensorName(sensorId)}</strong>:  
                <span className="text-green-600"> Activo</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No hay sensores activos</li>
          )}
        </ul>
      </div>

      {/* 🌡 Últimas Mediciones */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-semibold text-green-700">🌡 Últimas Mediciones</h2>
        <ul className="text-gray-600">
          {sensorData.length > 0 ? (
            [...new Set(sensorData.map((r) => r.fk_id_sensor))].map((sensorId) => {
              const latestReading = sensorData
                .filter((r) => r.fk_id_sensor === sensorId)
                .slice(-1)[0];

              return (
                <li key={sensorId} className="border-b py-2">
                  <strong>Sensor: {getSensorName(sensorId)}</strong>:  
                  <span className="font-medium text-blue-600">{latestReading.valor_medicion ?? "--"}°</span>  
                  (<span className="text-gray-500">{new Date(latestReading.fecha_medicion).toLocaleTimeString()}</span>)
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">No hay mediciones disponibles</li>
          )}
        </ul>
      </div>

      {/* 📊 Gráficos */}
      <div className="bg-white shadow-md rounded-lg p-9 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold text-green-700">📊 Gráficos de Sensores y Mediciones</h2>
        <Carousel>
          <CarouselContent>
            {Object.keys(chartsData).map((sensorId, index) => (
              <CarouselItem key={index}>
                <h3 className="text-lg font-semibold text-center">
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
      </div>
    </div>
  );
};

export default HomePage;
