import { useState, useEffect } from "react";
import { useMideBySensorId, Mide } from "../hooks/iot/mide/useMideBySensorId";
import { useNavigate, useParams } from "react-router-dom";
import Tabla from "../components/globales/Tabla";

interface TableData {
  id: number;
  fecha: string;
  valor: number;
  unidad: string;
}

const HistoricalDataTable = () => {
  const { sensorId } = useParams();
  const selectedSensor = Number(sensorId);

  console.log('🚀 Parámetro sensorId:', sensorId, 'Convertido a número:', selectedSensor);

  // ✅ Cambiado "readings" por "data"
  const { data: sensorReadings, sensor, isLoading, error } = useMideBySensorId(selectedSensor);

  console.log('📦 Datos del hook:', {
    sensorReadings,
    sensor,
    isLoading,
    error
  });

  const [filteredData, setFilteredData] = useState<TableData[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('🔄 Ejecutando efecto para transformar datos');

    // ✅ Usar directamente sensorReadings
    if (!sensorReadings?.length || !selectedSensor) {
      console.warn('⚠ No hay lecturas o sensor no válido', {
        sensorReadings,
        selectedSensor
      });
      setFilteredData([]);
      return;
    }

    console.log('📊 Datos crudos recibidos:', sensorReadings);

    const formattedReadings = sensorReadings
      .map((reading: Mide) => {
        console.log('📝 Procesando lectura:', reading);

        const fecha = new Date(reading.fecha_medicion);

        if (isNaN(fecha.getTime())) {
          console.error('❌ Fecha inválida:', reading.fecha_medicion);
        }

        return {
          id: reading.id,
          fecha: fecha.toLocaleString(),
          valor: Number(reading.valor_medicion),
          unidad: sensor?.unidad_medida || "",
        };
      })
      .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());

    console.log('✨ Datos transformados:', formattedReadings);

    setFilteredData(formattedReadings);
  }, [sensorReadings, selectedSensor, sensor]);

  useEffect(() => {
    console.log('🛠️ Estado filteredData actualizado:', filteredData);
  }, [filteredData]);

  if (isLoading) {
    console.log('⏳ Estado de carga activo');
    return <p className="text-center text-gray-500">Cargando datos...</p>;
  }

  if (error) {
    console.error('💥 Error detectado:', error);
    return <p className="text-center text-red-500">Error: {error.message}</p>;
  }

  if (!sensor) {
    console.warn('🔍 Sensor no encontrado');
    return <p className="text-center text-red-500">Sensor no encontrado</p>;
  }

  console.log('📋 Datos finales para Tabla:', {
    headers: ["ID", "Fecha", "Valor", "Unidad"],
    data: filteredData,
    sensorInfo: sensor
  });

  return (
    <div className="p-6 bg-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-green-600">
          Datos del Sensor: {sensor.nombre_sensor}
        </h2>
        <button
          onClick={() => navigate(-1)}
          className="text-green-600 hover:text-green-800"
        >
          ⬅ Volver
        </button>
      </div>

      <Tabla
        title="Registros del Sensor"
        headers={["ID", "Fecha", "Valor", "Unidad"]}
        data={filteredData}
        onClickAction={(row) => {
          console.log('🖱️ Click en fila:', row);
        }}
        onUpdate={(row) => {
          console.log('✏️ Click en actualizar:', row);
        }}
        onCreate={() => {
          console.log('Click en crear nuevo');
        }}
        createButtonTitle="Nuevo Registro"
      />
    </div>
  );
};

export default HistoricalDataTable;
