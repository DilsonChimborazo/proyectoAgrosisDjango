import { useQuery } from "@tanstack/react-query";
import axios from "axios";
 

export const useLotePorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["lote", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`/api/lote/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
