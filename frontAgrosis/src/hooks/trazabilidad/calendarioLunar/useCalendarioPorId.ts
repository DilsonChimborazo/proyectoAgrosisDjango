import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useCalendarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["CalendarioLunar", id], // Clave específica para identificar esta consulta
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado"); // Verifica que se proporcione un ID válido
            const { data } = await axios.get(`/api/calendario_lunar/${id}`); // Endpoint correspondiente
            return data;
        },
        enabled: !!id, // Activa la consulta solo si el ID está definido
    });
};
