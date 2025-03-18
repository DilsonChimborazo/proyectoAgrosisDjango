import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useControlFitosanitarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["ControlFitosanitario", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            
            const { data } = await axios.get(`${apiUrl}control_fitosanitario/${id}`);
            console.log("📋 Datos del Control Fitosanitario obtenidos:", data);
            return data;
        },
        enabled: !!id,
    });
};
