import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCalendarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["CalendarioLunar", id], // Clave específica para identificar esta consulta
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado"); // Verifica que se proporcione un ID válido
            const { data } = await axios.get(`${apiUrl}calendario_lunar/${id}`); // Endpoint correspondiente
            console.log("🌕 Datos obtenidos del backend:", data); // Imprime los datos obtenidos para depuración
            return data;
        },
        enabled: !!id, // Activa la consulta solo si el ID está definido
    });
};
