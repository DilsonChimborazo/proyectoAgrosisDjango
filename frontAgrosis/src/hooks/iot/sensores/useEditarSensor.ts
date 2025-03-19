import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Sensores {
    id: number;
    nombre_sensor: string;
    tipo_sensor: string;
    unidad_medida: string;
    descripcion: string;
    medida_minima: number;
    medida_maxima: number;
}

export const useEditarSensor = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (sensorActualizado: Sensores) => {
            const { id, ...datos } = sensorActualizado;

            // Validar antes de enviar
            if (
                !datos.nombre_sensor.trim() ||
                !datos.tipo_sensor.trim() ||
                !datos.unidad_medida.trim() ||
                !datos.descripcion.trim() ||
                datos.medida_minima === undefined ||
                datos.medida_maxima === undefined
            ) {
                throw new Error("⚠️ Datos inválidos. Por favor, revisa los campos.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}sensores/${id}/`, datos, {
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
