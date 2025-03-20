import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useCalendarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["CalendarioLunar", id], 
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}calendario_lunar/${id}`);
            console.log("🌕 Datos obtenidos del backend:", data); // 👀 aqui se Verifican los datos
            return data;
        },
        enabled: !!id, // Solo se ejecuta la consulta si el ID está definido
    });
};
