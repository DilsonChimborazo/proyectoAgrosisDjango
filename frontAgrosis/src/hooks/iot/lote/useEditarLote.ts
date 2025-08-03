import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

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

            if (!token) {
                throw new Error("No se encontró el token. Por favor, inicia sesión.");
            }

            const headers = {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`, // Añadimos el token
            };

            try {
                const { data } = await axios.put(`/api/lote/${id}/`, datos, { headers });
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["lote"] });
        },
        onError: (error: any) => {
            console.error("❌ Error al actualizar el Lote:", error);
        },
    });
};