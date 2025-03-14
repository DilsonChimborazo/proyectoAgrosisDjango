import { useState, useEffect } from "react";

const WS_URL = "ws://localhost:8000/ws/api/mide/";

export interface Mide {
  valor_medicion: number;
  fecha_medicion: string;
}

export function useMide() {
  const [sensorData, setSensorData] = useState<Mide | null>(null);

  useEffect(() => {
    const socket = new WebSocket(WS_URL);

    socket.onopen = () => {
      console.log("WebSocket conectado");
    };

    socket.onmessage = (event) => {
      try {
        const data: Mide = JSON.parse(event.data);
        if (data.valor_medicion !== undefined && data.fecha_medicion) {
          setSensorData(data);
        }
      } catch (error) {
        console.error("Error procesando mensaje:", error);
      }
    };

    socket.onerror = (event) => {
      console.error("WebSocket error:", event);
    };

    socket.onclose = (event) => {
      console.warn("WebSocket cerrado:", event);
    };

    return () => socket.close();
  }, []);

  return sensorData;
}
