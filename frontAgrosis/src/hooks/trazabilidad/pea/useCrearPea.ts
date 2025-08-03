import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Pea {
    nombre_pea: string;
    descripcion: string;
    tipo_pea: 'Plaga' | 'Enfermedad' | 'Arvense' | String;
}

// Hook personalizado para crear un nuevo PEA
export const useCrearPea = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoPea: Pea) => {
            const { data } = await axios.post(`/api/pea/`, nuevoPea);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Pea"] }); 
        },
    });
};
