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
            const { id, ...datos } = calendarioActualizado; // Extraer el ID para usarlo en la URL
            const { data } = await axios.put(`${apiUrl}calendario_lunar/${id}/`, datos); // Enviar PUT al endpoint
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["CalendarioLunar"] }); // Invalida la caché relacionada para refrescar los datos
        },
    });
};
