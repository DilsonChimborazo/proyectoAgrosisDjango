import { useState, useEffect } from "react";
import { useMide } from "../../hooks/iot/useMide";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

export default function SensorDisplay() {
    const [sensorReadings, setSensorReadings] = useState({
        labels: [] as string[],
        data: [] as number[],
    });

    const sensorData = useMide();

    useEffect(() => {
        if (sensorData && sensorData.fecha_medicion && typeof sensorData.valor_medicion === "number") {
            const formattedDate = new Date(sensorData.fecha_medicion).toLocaleTimeString();

            setSensorReadings((prevData) => {
                const newLabels = [...prevData.labels, formattedDate].slice(-10); // Máximo 10 valores
                const newData = [...prevData.data, sensorData.valor_medicion].slice(-10);

                return {
                    labels: newLabels,
                    data: newData,
                };
            });
        }
    }, [sensorData]);

    const data = {
        labels: sensorReadings.labels,
        datasets: [
            {
                label: "Temperatura (°C)",
                data: sensorReadings.data,
                borderColor: "rgb(75, 192, 192)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                tension: 0.1,
            },
        ],
    };

    return (
        <div className="max-w-md mx-auto mt-10 shadow-lg rounded-2xl bg-white p-6">
            <div className="text-center">
                <h2 className="text-xl font-bold">Sensor en Tiempo Real</h2>
                <div className="mt-4">
                    {sensorData ? (
                        <>
                            <p className="text-2xl font-semibold text-blue-600">{sensorData.valor_medicion} °C</p>
                            <p className="text-gray-500 text-sm">Última lectura: {sensorData.fecha_medicion}</p>
                        </>
                    ) : (
                        <p className="text-gray-500">Esperando datos...</p>
                    )}
                </div>
                <div className="mt-8">
                    {sensorReadings.data.length > 0 ? (
                        <Line data={data} />
                    ) : (
                        <p>Cargando gráfico...</p>
                    )}
                </div>
            </div>
        </div>
    );
}
