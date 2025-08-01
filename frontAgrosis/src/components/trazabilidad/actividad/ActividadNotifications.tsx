import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

const apiUrl = import.meta.env.VITE_WS_URL;

interface Notification {
  id: number;
  usuario: string;
  actividad: string;
  fecha: string;
}

const ActividadNotifications: React.FC = () => {
  const [, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl =`${apiUrl}asignaciones_actividades/`;
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      addToast({
        title: "Conexión Establecida",
        description: "Conectado al servidor de notificaciones.",
        timeout: 3000,
        color: "success",
      });
    };

    socketRef.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.message) {
          // Agregar la notificación al estado
          setNotifications((prev) => [...prev, data.message]);

          // Mostrar un toast con los detalles de la asignación
          addToast({
            title: "Nueva Asignación de Actividad",
            description: `Asignación ID: ${data.message.id} - ${data.message.usuario} asignado a ${data.message.actividad} para el ${data.message.fecha}`,
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
            color: "danger",
          });
        }
      } catch (error) {
        addToast({
          title: "Error",
          description: "No se pudo procesar la notificación.",
          timeout: 5000,
          color: "danger",
        });
      }
    };

    socketRef.current.onclose = () => {
      addToast({
        title: "Conexión Cerrada",
        description: "Se perdió la conexión con el servidor de notificaciones.",
        timeout: 5000,
        color: "warning",
      });
    };

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  return (
    <div style={styles.container}></div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    padding: "10px",
    borderBottom: "1px solid #ccc",
    marginBottom: "10px",
  },
};

export default ActividadNotifications;