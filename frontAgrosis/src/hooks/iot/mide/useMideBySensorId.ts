import { useState, useEffect } from "react";

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces
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
  data: Mide[];
  sensor: Sensor | null;
  isLoading: boolean;
  error: Error | null;
}

export const useMideBySensorId = (sensorId: number): MideBySensorIdResponse => {
  const [data, setData] = useState<Mide[]>([]);
  const [sensor, setSensor] = useState<Sensor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!sensorId) return;

    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
    
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No se encontró el token en localStorage");
    }

    const readingsRes = await fetch(`${apiUrl}mide/por-sensor/${sensorId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    });

    if (!readingsRes.ok) {
      throw new Error("No se pudieron obtener las lecturas del sensor.");
    }
    const readingsData = await readingsRes.json();
    setData(readingsData.data);

    const sensorRes = await fetch(`${apiUrl}sensores/${sensorId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    if (!sensorRes.ok) {
      throw new Error("No se pudieron obtener los detalles del sensor.");
    }
    const sensorData = await sensorRes.json();
    setSensor(sensorData);
  } catch (err) {
    const customError = err instanceof Error ? err : new Error("Error desconocido");
    setError(customError);
    setData([]);
    setSensor(null);
  } finally {
    setIsLoading(false);
  }};
    
    fetchData();
  }, [sensorId]);

  return { data, sensor, isLoading, error };
};
