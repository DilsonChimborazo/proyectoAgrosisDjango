import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Eras{
    id: number;
    nombre: string;
    fk_id_lote: number;
    descripcion: string;
    estado: boolean;
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
        `api/eras/`,
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




