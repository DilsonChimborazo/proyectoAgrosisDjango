import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface CalendarioLunar {
    fecha: string;
    descripcion_evento: string;
    evento: string;
}

export const useCrearCalendarioLunar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoCalendario: CalendarioLunar) => {
            const { data } = await axios.post(`/api/calendario_lunar/`, nuevoCalendario);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CalendarioLunar"] }); // Actualización automática de datos
        },
    });
};
