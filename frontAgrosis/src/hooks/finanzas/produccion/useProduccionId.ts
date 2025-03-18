import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useProduccionId = (id_produccion: string | undefined) => {
    return useQuery({
        queryKey: ["Produccion", id_produccion], 
        queryFn: async () => {
            if (!id_produccion) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}produccion/${id_produccion}`);
            console.log("🌱 Datos obtenidos del backend:", data); // 👀 Verifica los datos
            return data;
        },
        enabled: !!id_produccion, 
    });
};
