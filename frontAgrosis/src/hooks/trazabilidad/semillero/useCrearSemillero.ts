import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semilleros {
    nombre_semilla: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export const useCrearSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoSemillero: Semilleros) => {
            const { data } = await axios.post(`${apiUrl}semilleros/`, nuevoSemillero);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["semilleros"] }); 
        },
    });
};