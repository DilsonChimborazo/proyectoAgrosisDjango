import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useVentaId = (id_venta: string | undefined) => {
    return useQuery({
        queryKey: ["venta", id_venta], 
        queryFn: async () => {
            if (!id_venta) throw new Error("ID no proporcionado");
            const { data } = await axios.get(`${apiUrl}venta/${id_venta}`);
            console.log("🌱 Datos obtenidos del backend:", data); // 👀 Verifica los datos
            return data;
        },
        enabled: !!id_venta, 
    });
};
