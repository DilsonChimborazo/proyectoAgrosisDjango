import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    nombre: string;
    tipo: string;
    precio_unidad: number;
    stock: number;
    unidad_medida: string;
}

export const useCrearInsumo = () => {
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
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        },
        onSuccess: () => {
            console.log("✅ Insumo creado con éxito");
            queryClient.invalidateQueries({ queryKey: ["insumo"] });
        },
        onError: (error: any) => {
            console.error("❌ Error al crear el insumo:", error.response?.data || error.message);
        },
    });
};
