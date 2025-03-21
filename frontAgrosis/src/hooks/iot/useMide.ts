import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "ws://localhost:8000/ws/api/mide/";
const API_SENSORES = "http://localhost:8000/api/sensores/";

// 📌 Interfaz para Sensores
export interface Sensor {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

// 📌 Interfaz para las mediciones del WebSocket
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
  const reconnectAttempts = useRef(0);
  const isManuallyClosed = useRef(false);

  // 📌 Conexión WebSocket con reconexión automática
  const connectWebSocket = useCallback(() => {
    if (isManuallyClosed.current) return;
    console.log("🔄 Intentando conectar al WebSocket...");

    const socket = new WebSocket(WS_URL);
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("✅ WebSocket conectado");
      reconnectAttempts.current = 0;
    };

    socket.onmessage = (event) => {
      console.log("📩 Mensaje recibido del WebSocket:", event.data);

      if (!event.data) {
        console.warn("⚠ No se recibió ningún dato del WebSocket");
        return;
      }

      try {
        const data: Mide | Mide[] = JSON.parse(event.data);
        console.log("📊 Datos procesados:", data);

        setSensorData((prev) => {
          const updatedData = Array.isArray(data) ? [...prev, ...data] : [...prev, data];
          console.log("📈 Cantidad de mediciones almacenadas:", updatedData.length);
          return updatedData.slice(-50); // Mantener las últimas 50 mediciones
        });
      } catch (error) {
        console.error("❌ Error procesando mensaje del WebSocket:", error);
      }
    };

    socket.onerror = (error) => {
      console.error("❌ WebSocket error:", error);
      socket.close();
    };

    socket.onclose = () => {
      if (!isManuallyClosed.current) {
        console.warn("⚠ WebSocket cerrado, intentando reconectar...");
        const retryTime = Math.min(5000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current = Math.min(reconnectAttempts.current + 1, 6); // Limita intentos
        setTimeout(connectWebSocket, retryTime);
      }
    };
  }, []);

  // ✅ Obtener sensores desde la API REST
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        console.log("🌍 Obteniendo lista de sensores...");
        const response = await fetch(API_SENSORES);
        if (!response.ok) throw new Error("Error al obtener sensores");
        const data: Sensor[] = await response.json();
        console.log("📊 Sensores obtenidos:", data);
        setSensors(data);
      } catch (error) {
        console.error("❌ Error obteniendo sensores:", error);
      }
    };

    fetchSensors();
  }, []);

  // ✅ Conectar WebSocket al montar el componente
  useEffect(() => {
    isManuallyClosed.current = false;
    connectWebSocket();
    return () => {
      isManuallyClosed.current = true;
      socketRef.current?.close();
      console.log("🚫 WebSocket cerrado manualmente");
    };
  }, [connectWebSocket]);

  const closeWebSocket = () => {
    isManuallyClosed.current = true;
    socketRef.current?.close();
    console.log("🚫 WebSocket cerrado manualmente");
  };

  return { sensorData, sensors, closeWebSocket };
}