import  { useEffect, useRef } from "react";
import { showToast } from "@/components/globales/Toast";

interface WebSocketMessage {
  type: string;
  titulo: string;
  mensaje: string;
  id?: number;
  fecha?: string;
}

const InsumoNotifications = () => {
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 5;

  const getWebSocketUrl = (): string | null => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.warn("No se encontró token en localStorage");
      return null;
    }

    const baseUrl = '/ws/api/';
    return `${baseUrl}insumos/?token=${token}`;
  };

  const setupWebSocket = () => {
    const wsUrl = getWebSocketUrl();
    if (!wsUrl) return;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {

      reconnectAttempts.current = 0;
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data: WebSocketMessage = JSON.parse(event.data);
        if (data.type === 'notification') {
          showToast({
            title: data.titulo,
            description: data.mensaje,
            variant: "info",
            timeout: 7000
          });
        }
      } catch (error) {
        console.error("❌ Error procesando mensaje:", error);
      }
    };

    socketRef.current.onerror = (error) => {
      console.error("❌ Error en WebSocket:", error);
    };

    socketRef.current.onclose = (event) => {
      if (!event.wasClean && reconnectAttempts.current < maxReconnectAttempts) {
        const delay = Math.min(10000, 1000 * Math.pow(2, reconnectAttempts.current));
        reconnectAttempts.current += 1;
        setTimeout(setupWebSocket, delay);
      } else if (!event.wasClean) {
        console.error("❌ Máximo de intentos de reconexión alcanzado");
      }
    };
  };

  useEffect(() => {
    // Esperar a que la app esté completamente cargada
    const timer = setTimeout(setupWebSocket, 500);

    return () => {
      clearTimeout(timer);
      if (socketRef.current?.readyState === WebSocket.OPEN) {
        socketRef.current.close();
      }
    };
  }, []);

  return null; // Componente invisible
};

export default InsumoNotifications;