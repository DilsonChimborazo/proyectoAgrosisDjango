import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Asignacion {
    fecha: String;
    observaciones: string;
    fk_id_actividad: string;
    id_identificacion: string;

}

export const useCrearAsignacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaAsignacion: Asignacion) => {
            const { data } = await axios.post(`${apiUrl}asignaciones_actividades/`, nuevaAsignacion);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["asignaciones_actividades"] }); 
        },
    });
};