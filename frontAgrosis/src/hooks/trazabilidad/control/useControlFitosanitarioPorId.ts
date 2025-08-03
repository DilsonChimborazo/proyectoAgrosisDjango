import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useControlFitosanitarioPorId = (id: string | undefined) => {
    return useQuery({
        queryKey: ["ControlFitosanitario", id],
        queryFn: async () => {
            if (!id) throw new Error("ID no proporcionado");
            
            const { data } = await axios.get(`/api/control_fitosanitario/${id}`);
            return data;
        },
        enabled: !!id,
    });
};
