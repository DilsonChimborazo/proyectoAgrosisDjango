import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useActualizarHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (herramientaActualizada: any) => {
            const { id, ...datos } = herramientaActualizada;
            const { data } = await axios.put(`${apiUrl}herramientas/${id}`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
    });
};