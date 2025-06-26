import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useSemilleroPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Semillero", id], 
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}semilleros/${id}`);
            return data;
        },
        enabled: !!id, // Solo realiza la consulta si el ID está definido
    });
};
