import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";



export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
    ciclo_duracion: string;
}

export const useCrearTipoCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoTipoCultivo: Omit<TipoCultivo, 'id'>) => {
            const { data } = await axios.post(`/api/tipos_cultivo/`, nuevoTipoCultivo);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["tiposCultivo"] });
        },
    });
};