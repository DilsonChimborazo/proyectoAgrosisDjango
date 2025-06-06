import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Lotes {
    id: number;
    dimencion: number;
    nombre_lote: string;
    estado: boolean;
}

export const useEditarLote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (loteActualizado: Lotes) => {
            const { id, ...datos } = loteActualizado;

            // Validar antes de enviar
            if (!datos.dimencion || !datos.nombre_lote.trim() || typeof datos.estado !== "boolean") {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            const token = localStorage.getItem("token");
            console.log("🔑 Token para actualizar lote:", token);

            if (!token) {
                throw new Error("No se encontró el token. Por favor, inicia sesión.");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Añadimos el token
            };
            console.log("📋 Encabezados de la solicitud:", headers);

            console.log("🔍 URL de la solicitud:", `${apiUrl}lote/${id}/`);
            console.log("📦 Datos enviados:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}lote/${id}/`, datos, { headers });
                console.log("✅ Respuesta del servidor:", data);
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw error;
            }
        },
        onSuccess: () => {
            console.log("✅ Lote actualizado con éxito");
            queryClient.invalidateQueries({ queryKey: ["lote"] });
        },
        onError: (error: any) => {
            console.error("❌ Error al actualizar el Lote:", error);
        },
    });
};