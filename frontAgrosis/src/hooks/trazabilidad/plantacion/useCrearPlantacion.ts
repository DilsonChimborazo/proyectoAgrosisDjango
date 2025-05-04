import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Plantacion {
    fk_id_eras: number;
    fk_id_cultivo: number;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: number;
}

export const useCrearPlantacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaPlantacion: Plantacion) => {
            console.log("Datos enviados al backend:", nuevaPlantacion);
            const { data } = await axios.post(`${apiUrl}plantacion/`, nuevaPlantacion);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Plantaciones"] });
        },
    });
};