import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


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
    mutationFn: async (ventaActualizada: Venta) => {
      const { id_venta, ...datos } = ventaActualizada;
      
      try {
        const { data } = await axios.put(`/api/venta/${id_venta}/`, datos);
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          // Manejo simple de errores de Axios
          console.error("Error en la solicitud:", error.response?.data);
          throw new Error(error.response?.data?.message || "Error al actualizar la venta");
        }
        throw error;
      }
    },
    onSuccess: (_data, variables) => {
      // Invalida ambas queries como en tu versión original
      queryClient.invalidateQueries({ queryKey: ["venta"] });
      queryClient.invalidateQueries({ queryKey: ["venta", variables.id_venta] });
    },
    onError: (error: Error) => {
      // Solo un console.error básico
      console.error("Error al actualizar venta:", error.message);
    }
  });
};