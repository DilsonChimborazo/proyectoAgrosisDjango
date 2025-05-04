import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const usePlantacionPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["Plantacion", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}plantacion/${id}`);
            console.log("🌱 Datos obtenidos del backend:", data);
            return data;
        },
        enabled: !!id,
    });
};