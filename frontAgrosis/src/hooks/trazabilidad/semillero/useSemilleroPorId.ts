import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useSemilleroPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Semillero", id], 
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/semilleros/${id}`);
            return data;
        },
        enabled: !!id, // Solo realiza la consulta si el ID está definido
    });
};
