import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export const useVentaId = (id_venta: string | undefined) => {
    return useQuery({
        queryKey: ["venta", id_venta], 
        queryFn: async () => {
            if (!id_venta) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`/api/venta/${id_venta}`);
            return data;
        },
        enabled: !!id_venta, 
    });
};
