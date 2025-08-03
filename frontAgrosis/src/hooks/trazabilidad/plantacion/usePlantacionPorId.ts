import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const usePlantacionPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Plantacion", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/plantacion/${id}`);
            return data;
        },
        enabled: !!id,
    });
};