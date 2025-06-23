import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; 

export const useInsumoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["insumo", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`${apiUrl}insumo/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
