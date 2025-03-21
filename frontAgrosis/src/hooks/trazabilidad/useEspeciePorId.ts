import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useEspeciePorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Especie", id], // Clave específica para identificar esta consulta
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado"); // Verifica que el ID sea válido
            const { data } = await axios.get(`${apiUrl}especies/${id}/`); // Endpoint de la especie
            console.log("🌱 Datos obtenidos del backend:", data); // Depuración
            return data;
        },
        enabled: !!id, // Ejecutar solo si el ID existe
    });
};
