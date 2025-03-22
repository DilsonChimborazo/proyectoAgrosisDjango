import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface CalendarioLunar {
    fecha: string;
    descripcion_evento: string;
    evento: string;
}

export const useCrearCalendarioLunar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoCalendario: CalendarioLunar) => {
            console.log("Datos enviados al backend:", nuevoCalendario);
            const { data } = await axios.post(`${apiUrl}calendario_lunar/`, nuevoCalendario);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CalendarioLunar"] }); // Actualización automática de datos
        },
    });
};
