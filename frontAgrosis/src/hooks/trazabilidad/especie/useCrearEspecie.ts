import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo | number; 
  }
  
  interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
  }
export const useCrearEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaEspecie: Omit<Especie, 'id'>) => {
            const response = await axios.post(`/api/especies/`, nuevaEspecie);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["especies"] });
        },
    });
};