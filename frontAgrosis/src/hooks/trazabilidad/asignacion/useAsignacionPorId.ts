import { useQuery } from "@tanstack/react-query";
import axios from "axios";



export const useAsignacionporId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["sensores", id],
        queryFn: async () => {
            if (!id) {
                throw new Error("ID no proporcionado");
            }
            const { data } = await axios.get(`/api/asignaciones_actividades/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
