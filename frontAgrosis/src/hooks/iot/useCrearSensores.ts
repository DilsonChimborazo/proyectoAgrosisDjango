import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Sensores {
    nombre_sensor: string;
    tipo_sensor: string;
    unidad_medida: string;
    descripcion: string;
    medida_minima: number;
    medida_maxima: number;
}

export const useCrearSensores = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoSensor: Sensores) => {
            const { data } = await axios.post(`${apiUrl}sensores/`, nuevoSensor);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["sensores"] }); 
        },
    });
};




