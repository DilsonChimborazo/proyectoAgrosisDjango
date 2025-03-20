import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id: number;
    nombre_semilla: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export const useActualizarSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (semilleroActualizado: Semillero) => {
            const { id, ...datos } = semilleroActualizado;
            const { data } = await axios.put(`${apiUrl}semillero/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Semilleros"] }); // Refresca la lista de semilleros
        },
    });
};
