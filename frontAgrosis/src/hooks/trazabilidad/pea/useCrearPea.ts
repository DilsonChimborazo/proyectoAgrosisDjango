import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Pea {
    nombre_pea: string;
    descripcion: string;
}

// Hook personalizado para crear un nuevo PEA
export const useCrearPea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoPea: Pea) => {
            console.log("Datos enviados al backend:", nuevoPea);
            const { data } = await axios.post(`${apiUrl}pea/`, nuevoPea);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pea"] }); 
        },
    });
};
