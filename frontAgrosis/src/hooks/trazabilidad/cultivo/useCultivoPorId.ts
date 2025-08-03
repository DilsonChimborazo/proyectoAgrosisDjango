import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useCultivoPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Cultivo", id], 
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/cultivo/${id}`);
            return data;
        },
        enabled: !!id, 
    });
};

