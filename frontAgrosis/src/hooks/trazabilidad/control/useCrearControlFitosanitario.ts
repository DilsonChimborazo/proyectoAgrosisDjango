import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    fecha_control: string;
    descripcion: string;
    tipo_control: string;
    fk_id_cultivo: number;
    fk_id_pea: number;
}

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
    tipo_pea: string;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
}


export const useCrearControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoControl: ControlFitosanitario) => {
            const { data } = await axios.post(`${apiUrl}control_fitosanitario/`, nuevoControl);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["control_fitosanitario"] }); 
        },
    });
};
