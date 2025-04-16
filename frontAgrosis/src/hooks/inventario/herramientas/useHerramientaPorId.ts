import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; 

export const useHerramientaPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["herramienta", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`${apiUrl}herramientas/${id}`);
            console.log("📋 Datos de la Pea obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
