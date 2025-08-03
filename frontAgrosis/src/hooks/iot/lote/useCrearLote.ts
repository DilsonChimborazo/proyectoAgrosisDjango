import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface Lotes {
    id: number;
    dimencion: number;
    nombre_lote: string;
    estado: Boolean;
}

export const useCrearLote = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaEra: Lotes) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
    const { data } = await axios.post(
        `/api/lote/`,
        nuevaEra,
        {
            headers: {
            Authorization: `Bearer ${token}`, 
            },
        }
    );

    return data;
    },
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["lote"] });
    },
    onError: (error: any) => {
        console.error("Error al crear una era:", error.message);
    },
    });
};




