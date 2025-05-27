import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id: number;
    nombre_h: string;
    cantidad_herramienta: number;
    estado: 'Disponible' | 'Prestado' | 'En reparacion';
    precio: number;
}

export const useActualizarHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (herramientaActualizada: Herramientas) => {
            const { id, ...datos } = herramientaActualizada;

            // Validar antes de enviar
            if (
                !datos.nombre_h.trim() ||
                !datos.estado.trim() ||
                datos.cantidad_herramienta < 0 ||
                datos.precio < 0
            ) {
                throw new Error("⚠️ Datos inválidos. Verifica los campos de la herramienta.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            // Obtener token de localStorage
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("⚠️ Token de autenticación no encontrado.");
            }

            try {
                const { data } = await axios.put(`${apiUrl}herramientas/${id}/`, datos, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw error;
            }
        },
        onSuccess: (data) => {
            console.log("🔁 Respuesta de la API:", data);
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
        onError: (error) => {
            console.error("❌ Error al actualizar la herramienta:", error);
        },
    });
};
