import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


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
            const { data } = await axios.post(`/api/residuos/`, nuevoResiduo);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Residuos"] });
        },
    });
};
