import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useSensorPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["sensores", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`/api/sensores/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
