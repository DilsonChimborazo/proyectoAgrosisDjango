import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

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
            console.log("🚀 Datos enviados al backend:", nuevaEspecie);
            const response = await axios.post(`${apiUrl}especies/`, nuevaEspecie);
            console.log("📩 Respuesta del backend:", response.data);
            return response.data;
        },
        onSuccess: (data) => {
            console.log("✅ Especie creada con éxito, datos retornados:", data);
            queryClient.invalidateQueries({ queryKey: ["especies"] });
        },
        onError: (error: any) => {
            console.error("❌ Error al crear especie:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
            });
        },
    });
};