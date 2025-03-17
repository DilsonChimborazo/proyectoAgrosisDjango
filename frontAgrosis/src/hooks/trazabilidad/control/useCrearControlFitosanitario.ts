import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface NuevoControlFitosanitario {
    fecha_control: string;
    descripcion: string;
    fk_id_desarrollan: number;
}

// Hook para crear un nuevo Control Fitosanitario
export const useCrearControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoControl: NuevoControlFitosanitario) => {
            console.log("Datos enviados al backend:", nuevoControl);
            const { data } = await axios.post(`${apiUrl}control_fitosanitario/`, nuevoControl);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ControlFitosanitario"] }); 
        },
    });
};
