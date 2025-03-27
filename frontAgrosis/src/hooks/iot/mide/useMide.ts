import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "ws://192.168.0.113:8000/ws/api/mide/";
const WS_SENSORES_URL = "ws://192.168.0.113:8000/ws/api/sensores/";
const API_SENSORES = "http://192.168.0.113:8000/api/sensores/";
const API_MEDICIONES = "http://192.168.0.113:8000/api/mide/";
const API_CREATE_SENSOR = "http://192.168.0.113:8000/api/sensores/";

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
  fk_id_era: number;
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
      const response = await fetch(API_MEDICIONES);
      if (!response.ok) throw new Error("Error al obtener mediciones");
      const data: Mide[] = await response.json();
      console.log("📥 Datos históricos recibidos:", data);
      const processedData = data.map((item) => ({
        ...item,
        valor_medicion: Number(item.valor_medicion),
        fecha_medicion: parseDate(item.fecha_medicion).toISOString(),
      }));
      setSensorData(processedData);
      console.log("Datos procesados y guardados en sensorData:", processedData);
    } catch (error) {
      console.error("❌ Error obteniendo mediciones:", error);
    }
  };

  // Cargar sensores
  const fetchSensors = async () => {
    try {
      const response = await fetch(API_SENSORES);
      if (!response.ok) throw new Error("Error al obtener sensores");
      const data: Sensor[] = await response.json();
      console.log("📥 Sensores recibidos:", data);
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
      console.log("✅ WebSocket de mediciones conectado");
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const data: Mide = JSON.parse(event.data);
        console.log("📥 Mensaje WebSocket recibido:", data);
        if (data.fk_id_sensor && data.valor_medicion !== undefined && data.fecha_medicion) {
          setSensorData((prev) => {
            const exists = prev.some(
              (item) =>
                item.fecha_medicion === data.fecha_medicion &&
                item.fk_id_sensor === data.fk_id_sensor
            );
            if (exists) return prev;
            const newData = [
              ...prev,
              {
                ...data,
                valor_medicion: Number(data.valor_medicion),
                fecha_medicion: parseDate(data.fecha_medicion).toISOString(),
              },
            ];
            console.log("Datos actualizados en sensorData:", newData);
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
        console.log(`⚠ WebSocket de mediciones cerrado, reintentando en ${retryTime}ms...`);
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
      console.log("✅ WebSocket de sensores conectado");
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event: MessageEvent) => {
      try {
        const newSensor: Sensor = JSON.parse(event.data);
        console.log("📥 Mensaje WebSocket de sensores recibido:", newSensor);
        if (newSensor.id) {
          setSensors((prev) => {
            const exists = prev.some((sensor) => sensor.id === newSensor.id);
            if (exists) {
              console.log(`Sensor ${newSensor.nombre_sensor} ya existe en el estado sensors`);
              return prev;
            }
            console.log(`Añadiendo sensor ${newSensor.nombre_sensor} al estado sensors`);
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
        console.log(`⚠ WebSocket de sensores cerrado, reintentando en ${retryTime}ms...`);
        setTimeout(connectSensorWebSocket, retryTime);
      }
    };
  }, []);

  // Crear un nuevo sensor
  const createSensor = async (sensor: Omit<Sensor, "id">) => {
    try {
      const response = await fetch(API_CREATE_SENSOR, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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