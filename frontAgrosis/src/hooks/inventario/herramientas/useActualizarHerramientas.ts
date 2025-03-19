import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useActualizarHerramienta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (herramientaActualizada: any) => {
            const { id_herramientas, ...datos } = herramientaActualizada;
            const { data } = await axios.put(`${apiUrl}/herramientas/${id_herramientas}`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["herramientas"] });
        },
    });
};