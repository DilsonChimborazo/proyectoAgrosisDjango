import { useEffect } from "react";
import { useAuthContext } from "@/context/AuthContext";
import { showToast } from "@/components/globales/Toast";

const wsBaseUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws/api/';

const useWebSocketUsuario = () => {
  const { usuario, logout } = useAuthContext();

  useEffect(() => {
    if (!usuario?.id) return;

    const ws = new WebSocket(`${wsBaseUrl}usuario/${usuario.id}/`);

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "logout") {
        showToast({
          title: 'Esta cuenta fue desactivida ',
          description: 'Un administrador desactivo tu cuenta contacta soporte',
          variant: 'error',
        });
        logout();
      }
    };

    ws.onclose = () => {
      console.log("WebSocket cerrado");
    };

    return () => ws.close();
  }, [usuario]);
};

export default useWebSocketUsuario;
