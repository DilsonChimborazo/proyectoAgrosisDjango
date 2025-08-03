import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


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
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
    const { data } = await axios.post(
        `/api/sensores/`,
        nuevoSensor,
        {
            headers: {
            Authorization: `Bearer ${token}`, 
            },
        }
    );

    return data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["sensores"] });
    },
    onError: (error: any) => {
        console.error("Error al crear el sensor:", error.message);
    },
    });
};




