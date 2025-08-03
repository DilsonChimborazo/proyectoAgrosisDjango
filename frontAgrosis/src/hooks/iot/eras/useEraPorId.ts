import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useEraPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["eras", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`/api/eras/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
