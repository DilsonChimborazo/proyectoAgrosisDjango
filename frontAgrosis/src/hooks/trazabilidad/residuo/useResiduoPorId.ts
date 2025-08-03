import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useResiduoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Residuo", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/residuos/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
