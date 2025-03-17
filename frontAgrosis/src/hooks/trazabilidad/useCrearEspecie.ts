import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number;
}
export const useCrearEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaEspecie: Especie) => {
            const { data } = await axios.post(`${apiUrl}especie/`, nuevaEspecie);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["especie"] }); 
        },
    });
};