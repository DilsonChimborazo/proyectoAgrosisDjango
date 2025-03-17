import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface CalendarioLunar {
    fecha: string;
    descripcion: string;
    evento: string;

}

export const useCrearCalendarioLunar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoCalendarioLunar: CalendarioLunar) => {
            const { data } = await axios.post(`${apiUrl}calendario_lunar/`, nuevoCalendarioLunar);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["calendario_lunar"] }); 
        },
    });
};