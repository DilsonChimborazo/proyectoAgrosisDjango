import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Residuos {
    nombre: string;
    fecha: string;  
    descripcion: string;
    fk_id_cultivo: number;
    fk_id_tipo_residuo: number;
}

export const useCrearResiduo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoResiduo: Residuos) => {
            const { data } = await axios.post(`${apiUrl}residuos/`, nuevoResiduo);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Residuos"] });
        },
    });
};
