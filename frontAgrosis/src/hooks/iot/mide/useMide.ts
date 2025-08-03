import { useState, useEffect, useRef, useCallback } from "react";


const WS_URL = `/api/mide/`;
const WS_SENSORES_URL = `/api/sensores/`;
const API_SENSORES = `/api/sensores/`;
const API_MEDICIONES = `/api/mide/`;
const API_CREATE_SENSOR = `/api/sensores/`;

export interface Sensor {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

export interface Mide {
  fk_id_sensor: number;
  nombre_sensor: string;
  fk_id_plantacion: number;
  nombre_era: string;
  nombre_cultivo: string;
  valor_medicion: number;
  fecha_medicion: string;
}

export function useMide() {
  const [sensorData, setSensorData] = useState<Mide[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const socketRef = useRef<WebSocket | null>(null);
  const sensorSocketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const isManuallyClosed = useRef(false);

  // Función para parsear fechas
  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      console.error(`Fecha inválida: ${dateString}`);
      return new Date();
    }
    return date;
  };

  // Cargar datos históricos de mediciones
  const fetchMediciones = async () => {
    try {
        const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se encontró el token en localStorage");
      }
      const response = await fetch(API_MEDICIONES, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });
      if (!response.ok) throw new Error("Error al obtener mediciones");
      const data = await response.json();
      const processedData = data.map((item: any) => ({
        fk_id_sensor: item.fk_id_sensor?.id || item.fk_id_sensor,
        nombre_sensor: item.fk_id_sensor?.nombre_sensor || "Desconocido",
        fk_id_plantacion: item.fk_id_plantacion?.id || item.fk_id_plantacion,
        nombre_era: item.fk_id_plantacion?.fk_id_eras?.descripcion || "Sin Era",
        nombre_cultivo: item.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || "Sin Cultivo",
        valor_medicion: Number(item.valor_medicion),
        fecha_medicion: parseDate(item.fecha_medicion).toISOString(),
      }));
      setSensorData(processedData);
    } catch (error) {
      console.error("❌ Error obteniendo mediciones:", error);
    }
  };

  // Cargar sensores
  const fetchSensors = async () => {
  try {
    const token = localStorage.getItem("token"); 
    if (!token) {
      throw new Error("No se encontró el token en localStorage");
    }

    const response = await fetch(API_SENSORES, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      }
    });

    if (!response.ok) throw new Error("Error al obtener sensores");
    const data = await response.json();
    setSensors(data);
  } catch (error) {
    console.error("❌ Error obteniendo sensores:", error);
  }
  };

  // Conectar al WebSocket de mediciones
  const connectWebSocket = useCallback(() => {
    if (isManuallyClosed.current) return;
    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.fk_id_sensor &&
          data.valor_medicion !== undefined &&
          data.fecha_medicion &&
          data.fk_id_plantacion
        ) {
          setSensorData((prev) => {
            const exists = prev.some(
              (item) =>
                item.fecha_medicion === data.fecha_medicion &&
                item.fk_id_sensor === data.fk_id_sensor &&
                item.fk_id_plantacion === data.fk_id_plantacion
            );
            if (exists) return prev;
            const newData = [
              ...prev,
              {
                fk_id_sensor: data.fk_id_sensor,
                nombre_sensor: data.nombre_sensor || "Desconocido",
                fk_id_plantacion: data.fk_id_plantacion,
                nombre_era: data.nombre_era || "Sin Era",
                nombre_cultivo: data.nombre_cultivo || "Sin Cultivo",
                valor_medicion: Number(data.valor_medicion),
                fecha_medicion: parseDate(data.fecha_medicion).toISOString(),
              },
            ];
            return newData.slice(-100);
          });
        }
      } catch (error) {
        console.error("❌ Error al procesar mensaje WebSocket:", error);
      }
    };

    socket.onerror = (error) => console.error("❌ WebSocket error:", error);

    socket.onclose = () => {
      if (!isManuallyClosed.current) {
        const retryTime = Math.min(5000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current = Math.min(reconnectAttempts.current + 1, 6);
        setTimeout(connectWebSocket, retryTime);
      }
    };
  }, []);

  // Conectar al WebSocket de sensores
  const connectSensorWebSocket = useCallback(() => {
    if (isManuallyClosed.current) return;
    const socket = new WebSocket(WS_SENSORES_URL);
    sensorSocketRef.current = socket;

    socket.onopen = () => {
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const newSensor: Sensor = JSON.parse(event.data);
        if (newSensor.id) {
          setSensors((prev) => {
            const exists = prev.some((sensor) => sensor.id === newSensor.id);
            if (exists) {
              return prev;
            }
            return [...prev, newSensor];
          });
        }
      } catch (error) {
        console.error("❌ Error al procesar mensaje WebSocket de sensores:", error);
      }
    };

    socket.onerror = (error) => console.error("❌ Error en WebSocket de sensores:", error);

    socket.onclose = () => {
      if (!isManuallyClosed.current) {
        const retryTime = Math.min(5000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current = Math.min(reconnectAttempts.current + 1, 6);
        setTimeout(connectSensorWebSocket, retryTime);
      }
    };
  }, []);

  // Crear un nuevo sensor
  const createSensor = async (sensor: Omit<Sensor, "id">) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No se encontró el token en localStorage");
    }
    const response = await fetch(API_CREATE_SENSOR, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(sensor),
    });
    if (!response.ok) throw new Error("Error al crear sensor");
  } catch (error) {
    console.error("❌ Error creando sensor:", error);
    throw error;
  }
  };

  useEffect(() => {
    fetchSensors();
    fetchMediciones();
    connectWebSocket();
    connectSensorWebSocket();

    return () => {
      isManuallyClosed.current = true;
      socketRef.current?.close();
      sensorSocketRef.current?.close();
    };
  }, [connectWebSocket, connectSensorWebSocket]);

  return { sensorData, sensors, createSensor };
}