import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;
export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
}

export const useActualizarPea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (peaActualizada: Pea) => {
            const { id, ...datos } = peaActualizada;
            const { data } = await axios.put(`${apiUrl}pea/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pea"] });
        },
    });
};