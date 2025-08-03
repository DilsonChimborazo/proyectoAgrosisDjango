import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const usePeaPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Pea", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/pea/${id}`);
            return data;
        },
        enabled: !!id,
    });
};