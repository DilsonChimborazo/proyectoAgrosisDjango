import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: string;
}

export const useCrearInsumos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoInsumo: Insumo) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
            const { data } = await axios.post(
                `${apiUrl}insumo/`,
                nuevoInsumo,
                {
                    headers: {
                        Authorization: `Bearer ${token}`, 
                    },
                }
            );
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
        onError: (error: any) => {
            console.error("Error al crear el insumo:", error.message);
        },
    });
};
