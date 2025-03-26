// hooks/iot/mide/useMideBySensorId.ts
import { useState, useEffect } from "react";

// Interfaces para tipado (reutilizamos las mismas que en useMide)
export interface Mide {
  id: number;
  fk_id_sensor: number;
  valor_medicion: number;
  fecha_medicion: string;
}

export interface Sensor {
  id: number;
  nombre_sensor: string;
  unidad_medida: string;
  tipo_sensor: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

interface MideBySensorIdResponse {
  readings: Mide[];
  sensor: Sensor | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMideBySensorId = (sensorId: number): MideBySensorIdResponse => {
  const [readings, setReadings] = useState<Mide[]>([]);
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Obtener las lecturas del sensor por su ID
        const readingsResponse = await fetch(`http://127.0.0.1:8000/api/mide/?fk_id_sensor=${sensorId}`);
        if (!readingsResponse.ok) {
          throw new Error("Error al obtener las lecturas del sensor");
        }
        const readingsData: Mide[] = await readingsResponse.json();
        setReadings(readingsData);

        // Obtener los detalles del sensor
        const sensorResponse = await fetch(`http://127.0.0.1:8000/api/sensores/${sensorId}/`);
        if (!sensorResponse.ok) {
          throw new Error("Error al obtener los detalles del sensor");
        }
        const sensorData: Sensor = await sensorResponse.json();
        setSensor(sensorData);
      } catch (err) {
        setError(err instanceof Error ? err : new Error("Error desconocido"));
      } finally {
        setIsLoading(false);
      }
    };

    if (sensorId) {
      fetchData();
    }
  }, [sensorId]);

  return { readings, sensor, isLoading, error };
};