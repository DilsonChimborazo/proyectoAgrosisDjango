import { useState, useEffect, useRef, useCallback } from "react";

const WS_URL = "ws://localhost:8000/ws/api/mide/";
const API_SENSORES = "http://localhost:8000/api/sensores/"; // URL de la API para obtener los sensores

// Interfaz para Sensores
export interface Sensor {
  id: number;
  nombre_sensor: string;
  tipo_sensor: string;
  unidad_medida: string;
  descripcion: string;
  medida_minima: number;
  medida_maxima: number;
}

// Interfaz para las mediciones del WebSocket
export interface Mide {
  fk_id_sensor: number;
  nombre_sensor: string;
  fk_id_era: number;
  valor_medicion: number;
  fecha_medicion: string;
}

export function useMide() {
  const [sensorData, setSensorData] = useState<Mide[]>([]);
  const [sensors, setSensors] = useState<Sensor[]>([]); // Estado para los sensores
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const isManuallyClosed = useRef(false);
  const processedMeasurements = useRef<Set<string>>(new Set()); // Set para mediciones procesadas

  // 📌 Conexión WebSocket
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
      try {
        const data: Mide = JSON.parse(event.data);

        // Verificar si la medición ya fue procesada (si existe en el Set)
        const measurementId = `${data.fk_id_sensor}-${data.fecha_medicion}`;
        if (processedMeasurements.current.has(measurementId)) {
          console.log("🔄 Medición ya procesada, ignorando...");
          return; // No procesar si ya se había recibido esta medición
        }

        if (
          typeof data.valor_medicion === "number" &&
          typeof data.fk_id_sensor === "number" &&
          typeof data.fk_id_era === "number" &&
          typeof data.fecha_medicion === "string"
        ) {
          // Marcar la medición como procesada
          processedMeasurements.current.add(measurementId);

          // Agregar la nueva medición al estado
          setSensorData((prev) => [...prev, data]);

          // Aquí podrías enviar los datos a la base de datos
          // Por ejemplo:
          // sendToDatabase(data); // Enviar a la base de datos
        } else {
          console.warn("⚠ Datos WebSocket inválidos:", data);
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje:", error);
      }
    };

    socket.onerror = () => {
      console.error("❌ WebSocket error");
      socket.close();
    };

    socket.onclose = () => {
      if (!isManuallyClosed.current) {
        console.warn("⚠ WebSocket cerrado, intentando reconectar...");
        const retryTime = Math.min(5000, 1000 * 2 ** reconnectAttempts.current);
        reconnectAttempts.current += 1;
        setTimeout(connectWebSocket, retryTime);
      }
    };
  }, []);

  // ✅ Obtener sensores desde la API REST
  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await fetch(API_SENSORES);
        if (!response.ok) throw new Error("Error al obtener sensores");
        const data: Sensor[] = await response.json();
        setSensors(data); // Guardar sensores en el estado
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
    };
  }, [connectWebSocket]);

  const closeWebSocket = () => {
    isManuallyClosed.current = true;
    socketRef.current?.close();
    console.log("🚫 WebSocket cerrado manualmente");
  };

  return { sensorData, sensors, closeWebSocket };
}
