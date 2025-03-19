import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; 

export const useLotePorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["lote", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`${apiUrl}lote/${id}`);
            console.log("📋 Datos del lote obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
