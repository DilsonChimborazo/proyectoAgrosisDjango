import { useState, useEffect } from "react";
import { useMide } from "../hooks/iot/useMide";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";

const HomePage = () => {
  const { sensorData, sensors } = useMide();
  const [sensorReadings, setSensorReadings] = useState<any[]>([]);
  const [chartsData, setChartsData] = useState<{ [key: number]: any[] }>({});

  // Obtener nombre del sensor con verificación de datos
  const getSensorName = (sensorId: number) => {
    if (!sensors || sensors.length === 0) {
      return "Cargando sensores...";
    }
    const sensor = sensors.find((s) => s.id === sensorId);
    return sensor ? sensor.nombre_sensor : "Desconocido";
  };

  useEffect(() => {
    console.log("Sensores obtenidos:", sensors);
    console.log("Datos de medición recibidos:", sensorData);

    if (sensorData.length > 0) {
      setSensorReadings((prevReadings) => {
        const updatedReadings = [...prevReadings];

        sensorData.forEach((newReading) => {
          const index = updatedReadings.findIndex((reading) => reading.fk_id_sensor === newReading.fk_id_sensor);
          if (index !== -1) {
            updatedReadings[index] = newReading;
          } else {
            updatedReadings.push(newReading);
          }
        });

        return updatedReadings;
      });

      // Agrupar datos por sensor
      const groupedData: { [key: number]: any[] } = {};
      sensorData.forEach((reading) => {
        if (!groupedData[reading.fk_id_sensor]) {
          groupedData[reading.fk_id_sensor] = [];
        }
        groupedData[reading.fk_id_sensor].push({
          fecha: new Date(reading.fecha_medicion).toLocaleTimeString(),
          valor: reading.valor_medicion,
          sensor: getSensorName(reading.fk_id_sensor),
        });
      });

      setChartsData(groupedData);
    }
  }, [sensorData, sensors]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {/* Sensores Activos */}
      <div className=" bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-700">📡 Sensores Activos</h2>
        <ul className="text-gray-600">
          {sensorReadings.length > 0 ? (
            sensorReadings.map((reading, index) => (
              <li key={index} className="border-b py-2">
                <strong>Sensor: {getSensorName(reading.fk_id_sensor)}</strong>:  
                <span className="text-green-600"> Activo</span>
              </li>
            ))
          ) : (
            <li className="text-gray-500">No hay sensores activos</li>
          )}
        </ul>
      </div>

      {/* Últimas Mediciones */}
      <div className="bg-white shadow-md rounded-lg p-8">
        <h2 className="text-xl font-semibold text-gray-700">🌡 Últimas Mediciones</h2>
        <ul className="text-gray-600">
          {sensorReadings.length > 0 ? (
            sensorReadings.map((reading, index) => {
              let fechaMedicion = "Fecha desconocida";
              if (reading.fecha_medicion) {
                const fecha = new Date(reading.fecha_medicion);
                fechaMedicion = isNaN(fecha.getTime()) ? "Fecha inválida" : fecha.toLocaleTimeString();
              }

              return (
                <li key={index} className="border-b py-2">
                  <strong>Sensor: {getSensorName(reading.fk_id_sensor)}</strong>:  
                  <span className="font-medium text-blue-600">{reading.valor_medicion ?? "--"}°C</span>  
                  (<span className="text-gray-500">{fechaMedicion}</span>)
                </li>
              );
            })
          ) : (
            <li className="text-gray-500">No hay mediciones disponibles</li>
          )}
        </ul>
      </div>

      {/* Carrusel de gráficos */}
      <div className="bg-white shadow-md rounded-lg p-9 col-span-1 md:col-span-2">
        <h2 className="text-xl font-semibold text-gray-700">📊 Gráficos de Sensores y Mediciones</h2>
        {Object.keys(chartsData).length > 0 ? (
          <Carousel>
            <CarouselContent>
              {Object.keys(chartsData).map((sensorId, index) => (
                <CarouselItem key={index}>
                  <div className="p-4 shadow-md rounded-lg bg-gray-100">
                    <h3 className="text-lg font-semibold text-gray-700">{getSensorName(Number(sensorId))}</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={chartsData[Number(sensorId)]}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="fecha" />
                        <YAxis />
                        <Tooltip 
                          content={({ payload }) => {
                            if (payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <div className="bg-white shadow-md p-2 rounded-md text-gray-700">
                                  <p><strong>Sensor:</strong> {data.sensor}</p>
                                  <p><strong>Valor:</strong> {data.valor}°C</p>
                                  <p><strong>Hora:</strong> {data.fecha}</p>
                                </div>
                              );
                            }
                            return null;
                          }}
                        />
                        <Line type="monotone" dataKey="valor" stroke="#8884d8" activeDot={{ r: 8 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        ) : (
          <p className="text-gray-500">Esperando mediciones...</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
