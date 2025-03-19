import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Lotes {
    id: number;
    fk_id_ubicacion: number;
    dimencion: number;
    nombre_lote: string;
    estado: string;
}

export const useEditarLote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (loteActualizado: Lotes) => {
            const { id, ...datos } = loteActualizado;

            // Validar antes de enviar
            if (!datos.fk_id_ubicacion || !datos.dimencion || !datos.nombre_lote.trim() || !datos.estado.trim()) {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}lote/${id}/`, datos, {
                    headers: {
                        "Content-Type": "application/json", 
                    },
                });
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
        onError: (error) => {
            console.error("❌ Error al actualizar el Lote:", error);
        },
    });
};
