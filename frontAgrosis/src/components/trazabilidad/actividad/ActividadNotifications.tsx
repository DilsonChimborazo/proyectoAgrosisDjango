import React, { useEffect, useState, useRef } from "react";
import { addToast } from "@heroui/toast";
import { Button } from "@heroui/button";

interface Notification {
  id: number;
  usuario: string;
  actividad: string;
  fecha: string;
}

const ActividadNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const wsUrl = "ws://192.168.0.106:8000/ws/api/asignacion_actividades/";
    socketRef.current = new WebSocket(wsUrl);

    socketRef.current.onopen = () => {
      console.log("✅ Conectado al WebSocket:", wsUrl);
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
        console.log("📩 Mensaje recibido:", data);

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
        console.error("❌ Error al procesar el mensaje:", error);
        addToast({
          title: "Error",
          description: "No se pudo procesar la notificación.",
          timeout: 5000,
          color: "danger",
        });
      }
    };

    socketRef.current.onclose = (event) => {
      console.log("🔌 WebSocket cerrado:", event);
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
    <div style={styles.container}>
      <h2>Notificaciones de Asignaciones</h2>
      {notifications.length === 0 ? (
        <p>No hay notificaciones.</p>
      ) : (
        <ul style={styles.list}>
          {notifications.map((notification, index) => (
            <li key={index} style={styles.listItem}>
              <strong>ID: {notification.id}</strong> - {notification.usuario} asignado a{" "}
              <strong>{notification.actividad}</strong> para el {notification.fecha}
            </li>
          ))}
        </ul>
      )}
    </div>
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