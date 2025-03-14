import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
    fk_id_cultivo: number | null;
    cantidad_produccion: number;
    fecha: string;
}

export const useCrearProduccion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaProduccion: Produccion) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }

            const { data } = await axios.post(
                `${apiUrl}produccion/`,  // Ajusta la URL según tu endpoint
                nuevaProduccion,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["produccion"] });
        },
        onError: (error: any) => {
            console.error("Error al crear la producción:", error.message);
        },
    });
};
