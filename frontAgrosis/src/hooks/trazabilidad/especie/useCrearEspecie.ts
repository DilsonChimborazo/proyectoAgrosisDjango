import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number; // Aseguramos que sea `number`
}

export const useCrearEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaEspecie: Omit<Especie, 'id'>) => {
            console.log("🚀 Datos enviados al backend:", nuevaEspecie);
            const { data } = await axios.post(`${apiUrl}especies/`, nuevaEspecie);
            return data;
        },
        onSuccess: () => {
            console.log("✅ Especie creada con éxito");
            queryClient.invalidateQueries({ queryKey: ["especies"] });
        },
        onError: (error) => {
            console.error("❌ Error al crear especie:", error);
        },
    });
};