import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Eras{
    id: number;
    fk_id_lote: number;
    descripcion: string;
}

export const useCrearEras = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevaEra: Eras) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }
    const { data } = await axios.post(
        `${apiUrl}eras/`,
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
        queryClient.invalidateQueries({ queryKey: ["eras"] });
    },
    onError: (error: any) => {
        console.error("Error al crear una era:", error.message);
    },
    });
};




