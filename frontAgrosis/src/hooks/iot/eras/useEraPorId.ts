import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; 

export const useEraPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["eras", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`${apiUrl}eras/${id}`);
            console.log("📋 Datos de la Pea obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
