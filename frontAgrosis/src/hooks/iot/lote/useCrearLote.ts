import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Lotes {
    id: number;
    fk_id_ubicacion: number;
    dimencion: number;
    nombre_lote: string;
    estado: string;
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
        `${apiUrl}lote/`,
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




