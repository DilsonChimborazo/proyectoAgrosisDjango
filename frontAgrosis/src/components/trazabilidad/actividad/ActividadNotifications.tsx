import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

interface Notification {
  message: string;
}

const ActividadNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = "ws://127.0.0.1:8000/ws/asignacion_actividades/";
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => console.log("✅ Conectado al WebSocket:", wsUrl);

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        console.log("📩 Mensaje recibido:", data);

        if (data.mensaje) { 
          setNotifications((prev) => [...prev, { message: data.mensaje }]);

          addToast({
            title: "Nueva Asignación de Actividad",
            description: data.mensaje,
            timeout: 5000,
            endContent: (
              <Button size="sm" variant="solid" color="success">
                Ir
              </Button>
            ),
          });
        } else if (data.error) {
          addToast({
            title: "Error",
            description: data.error,
            timeout: 5000,
          });
        }
      } catch (error) {
        console.error("❌ Error al procesar el mensaje:", error);
      }
    };

    socketRef.current.onclose = (event) => {
      console.log("🔌 WebSocket cerrado:", event);
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div>

    </div>
  );
};

export default ActividadNotifications;
