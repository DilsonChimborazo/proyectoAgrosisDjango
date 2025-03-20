import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface CalendarioLunar {
    id: number;
    fecha: string;
    descripcion_evento: string;
    evento: string;
}

export const useActualizarCalendarioLunar = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (calendarioActualizado: CalendarioLunar) => {
            const { id, ...datos } = calendarioActualizado;
            const { data } = await axios.put(`${apiUrl}calendario_lunar/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CalendariosLunares"] }); // Actualizar la lista de calendarios lunares
        },
    });
};
