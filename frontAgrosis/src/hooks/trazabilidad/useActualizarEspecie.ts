import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number;
}

export const useActualizarEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (especieActualizada: Especie) => {
            const { id, ...datos } = especieActualizada;
            const { data } = await axios.put(`${apiUrl}especie/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Especies"] }); // Actualiza la lista de especies
        },
    });
};
