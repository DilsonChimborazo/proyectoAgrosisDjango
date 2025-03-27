import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL; 

export const useAsignacionporId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["sensores", id],
        queryFn: async () => {
            if (!id) {
                console.error("❌ Error: ID no proporcionado");
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`${apiUrl}asignaciones_actividades/${id}`);
            console.log("📋 Datos del sensor obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
