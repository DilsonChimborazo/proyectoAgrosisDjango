import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useMide } from "../../../hooks/iot/mide/useMide";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function SensorDisplay() {
  const sensorData = useMide();
  const [sensorReadings, setSensorReadings] = useState<{
    labels: string[];
    data: number[];
  }>({
    labels: [],
    data: [],
  });

  useEffect(() => {
    console.log("\ud83d\udccc sensorData recibido:", JSON.stringify(sensorData, null, 2));

    if (!Array.isArray(sensorData) || sensorData.length === 0) {
      console.warn("⚠️ No hay datos del sensor aún...");
      return;
    }

    const ultimaMedicion = sensorData[sensorData.length - 1];
    const { fecha_medicion, valor_medicion } = ultimaMedicion;

    if (!fecha_medicion || valor_medicion === undefined) {
      console.warn("⚠️ Datos del sensor incompletos:", ultimaMedicion);
      return;
    }

    // Convertir fecha correctamente
    const fecha = new Date(fecha_medicion);
    if (isNaN(fecha.getTime())) {
      console.error("❌ Fecha inválida recibida:", fecha_medicion);
      return;
    }

    // Convertir valor_medicion a número
    const valorNumerico = Number(valor_medicion);
    if (isNaN(valorNumerico)) {
      console.error("❌ Valor de medición inválido:", valor_medicion);
      return;
    }

    setSensorReadings((prev) => ({
      labels: [...prev.labels, fecha.toLocaleTimeString("es-ES")].slice(-10),
      data: [...prev.data, valorNumerico].slice(-10),
    }));
  }, [sensorData]);

  const chartData = {
    labels: sensorReadings.labels,
    datasets: [
      {
        label: "Medición Sensor (°C)",
        data: sensorReadings.data,
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        pointRadius: 4,
      },
    ],
  };

  return (
    <div className="max-w-lg mx-auto mt-8 shadow-md rounded-xl bg-white p-6">
      <h2 className="text-lg font-bold text-center text-gray-700">
        Sensor en Tiempo Real
      </h2>
      <div className="text-center mt-4">
        {sensorReadings.data.length > 0 ? (
          <>
            <p className="text-3xl font-semibold text-blue-600">
              {sensorReadings.data.slice(-1)[0]} °C
            </p>
            <p className="text-gray-500 text-sm">
              Última lectura: {sensorReadings.labels.slice(-1)[0]}
            </p>
          </>
        ) : (
          <p className="text-gray-500">Esperando datos...</p>
        )}
      </div>
      <div className="mt-6">
        {sensorReadings.data.length > 0 ? (
          <Line data={chartData} />
        ) : (
          <p>Cargando gráfico...</p>
        )}
      </div>
    </div>
  );
}
