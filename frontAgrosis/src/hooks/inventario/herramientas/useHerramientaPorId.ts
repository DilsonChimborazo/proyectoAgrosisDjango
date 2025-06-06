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
            try {
                const { data } = await axios.get(`${apiUrl}herramientas/${id}`);
                return data;
            } catch (error) {
                console.error("❌ Error al obtener la herramienta:", error);
                throw new Error("Error al obtener la herramienta");
            }
        },
        enabled: !!id, // Solo ejecuta la consulta si 'id' es válido (no undefined)
    });
};
