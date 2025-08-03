import { useQuery } from "@tanstack/react-query";
import axios from "axios";
 

export const useInsumoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["insumo", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`/api/insumo/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
