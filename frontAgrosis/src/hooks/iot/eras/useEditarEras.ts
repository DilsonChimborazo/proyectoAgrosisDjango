import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras {
    id: number;
    fk_id_lote: number;
    descripcion: string;
}

export const useEditarEras = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eraActualizada: Eras) => {
            const { id, ...datos } = eraActualizada;

            // Validar antes de enviar
            if (!datos.fk_id_lote || !datos.descripcion.trim()) {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}eras/${id}/`, datos, {
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
            console.log("✅ Era actualizada con éxito");
            queryClient.invalidateQueries({ queryKey: ["eras"] });
        },
        onError: (error) => {
            console.error("❌ Error al actualizar la Era:", error);
        },
    });
};
