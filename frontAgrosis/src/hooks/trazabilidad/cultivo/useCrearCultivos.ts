import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Cultivos {
    nombre_cultivo: string;
    fecha_plantacion: string; 
    descripcion: string;
    fk_id_especie: number;
    fk_id_semillero: number;
}


export const useCrearCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoCultivo: Cultivos) => {
            console.log("Datos enviados al backend:", nuevoCultivo);
            const { data } = await axios.post(`${apiUrl}cultivo/`, nuevoCultivo);

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Cultivos"] }); 
        },
    });
};
