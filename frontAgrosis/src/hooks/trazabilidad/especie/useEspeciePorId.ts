import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useEspeciePorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Especie", id], 
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}especie/${id}`);
            console.log("🌱 Datos obtenidos del backend:", data); // Verifica los datos
            return data;
        },
        enabled: !!id, // Solo se ejecuta si el ID está definido
    });
};
