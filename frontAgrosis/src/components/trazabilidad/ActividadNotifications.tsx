import React, { useEffect, useState } from "react";
import { addToast } from "@heroui/toast";

interface Notification {
    message: string;
}

interface ActividadNotificationsProps {
    userId: number;
}

const ActividadNotifications: React.FC<ActividadNotificationsProps> = ({ userId }) => {
    const [notifications, setNotifications] = useState<Notification[]>([]);

    useEffect(() => {
        if (userId === 0) {
            console.error("El userId es 0. Asegúrate de pasar un ID válido.");
            return;
        }

        const wsUrl = `ws://localhost:8000/ws/asignacion_actividades/`;
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("✅ Conectado al WebSocket:", wsUrl);
        };

        socket.onmessage = (event) => {
            console.log("📩 Mensaje recibido:", event.data);
            const data = JSON.parse(event.data);

            let message = "";
            if (data.message) {
                message = typeof data.message === "object" ? JSON.stringify(data.message) : data.message;
                setNotifications((prev) => [...prev, { message }]);

                addToast({
                    title: "📌 Nueva Asignación de Actividad",
                    description: message,
                    timeout: 5000,
                });
            } else if (data.error) {
                console.error("⚠️ Error recibido desde WebSocket:", data.error);
                addToast({
                    title: "⚠️ Error",
                    description: data.error,
                    timeout: 5000,
                });
            }
        };

        socket.onerror = (error) => {
            console.error("⚠️ Error en WebSocket:", error);
        };

        socket.onclose = (event) => {
            if (event.wasClean) {
                console.log(`🔌 WebSocket cerrado limpiamente, código: ${event.code}`);
            } else {
                console.error('⚠️ WebSocket cerrado inesperadamente');
            }
        };

        return () => {
            socket.close();
            console.log("🔌 Conexión WebSocket cerrada.");
        };
    }, [userId]);

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold">Notificaciones de Actividad</h2>
            {notifications.length === 0 ? (
                <p className="text-gray-500">No hay notificaciones</p>
            ) : (
                <ul className="mt-2">
                    {notifications.map((notif, index) => (
                        <li key={index} className="p-2 border-b border-gray-300">
                            {notif.message}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default ActividadNotifications;
