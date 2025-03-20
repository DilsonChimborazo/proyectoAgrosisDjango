import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
    id_produccion: number;
    fk_id: number | null;
    cantidad_produccion: number;
    fecha: string;
}


export const useActualizarProduccion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (ProduccionActualizado: Produccion) => {
            const { id_produccion, ...datos } = ProduccionActualizado;
            const { data } = await axios.put(`${apiUrl}produccion/${id_produccion}/`, datos);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["produccion"] }); // Invalida la lista general
            queryClient.invalidateQueries({ queryKey: ["produccion", variables.id_produccion] }); // Invalida el detalle
        },
    });
};
