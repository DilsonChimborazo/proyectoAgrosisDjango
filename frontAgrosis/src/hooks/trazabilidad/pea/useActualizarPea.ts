import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
    tipo_pea: string;
}

export const useActualizarPea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (peaActualizada: Pea) => {
            const { id, ...datos } = peaActualizada;
            const { data } = await axios.put(`/api/pea/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pea"] });
        },
    });
};