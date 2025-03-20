import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;


export interface Venta {
  id_venta: number;
  fk_id_venta: number | null;
  cantidad: number;
  precio_unidad: number;
  fecha: string;
}

export const useActualizarVenta = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (VentaActualizado: Venta) => {
            const { id_venta, ...datos } = VentaActualizado;
            const { data } = await axios.put(`${apiUrl}venta/${id_venta}/`, datos);
            return data;
        },
        onSuccess: (_data, variables) => {
            queryClient.invalidateQueries({ queryKey: ["venta"] }); // Invalida la lista general
            queryClient.invalidateQueries({ queryKey: ["venta", variables.id_venta] }); // Invalida el detalle
        },
    });
};
