import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Asignacion {
    id: number;
    fecha: String;
    observaciones: string;
    fk_id_actividad: number;
    id_identificacion: number;

}

export const useEditarAsignacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sensorActualizado: Asignacion) => {
            const { id, ...datos } = sensorActualizado;

            // Validar antes de enviar
            if (
                !datos.fecha.trim() ||
                !datos.observaciones.trim() ||
                !datos.fk_id_actividad === undefined ||
                !datos.id_identificacion === undefined 
            ) {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}asignaciones_actividades/${id}/`, datos, {
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
            console.log("✅ Sensor actualizado con éxito");
            queryClient.invalidateQueries({ queryKey: ["sensores"] });
        },
        onError: (error) => {
            console.error("❌ Error al actualizar el Sensor:", error);
        },
    });
};
