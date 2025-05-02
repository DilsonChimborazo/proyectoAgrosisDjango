import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
}

export const useCrearTipoCultivo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoTipoCultivo: Omit<TipoCultivo, 'id'>) => {
            console.log("🚀 Datos enviados al backend:", nuevoTipoCultivo);
            const { data } = await axios.post(`${apiUrl}tipos_cultivo/`, nuevoTipoCultivo);
            return data;
        },
        onSuccess: () => {
            console.log("✅ Tipo de cultivo creado con éxito");
            queryClient.invalidateQueries({ queryKey: ["tiposCultivo"] });
        },
        onError: (error) => {
            console.error("❌ Error al crear tipo de cultivo:", error);
        },
    });
};