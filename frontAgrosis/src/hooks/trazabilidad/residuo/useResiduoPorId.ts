import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const apiUrl = import.meta.env.VITE_API_URL;

export const useResiduoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Residuo", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            
            const { data } = await axios.get(`${apiUrl}residuos/${id}`);
            console.log("📋 Datos del Residuo obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
