import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Cultivos {
    nombre_cultivo: string; 
    descripcion: string;
    fk_id_especie: number;
}

export const useCrearCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoCultivo: Cultivos) => {
            const { data } = await axios.post(`${apiUrl}cultivo/`, nuevoCultivo);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Cultivos"] });
        },
        onError: (error: any) => {
            console.error("Error al crear el cultivo:", error);
        },
    });
};