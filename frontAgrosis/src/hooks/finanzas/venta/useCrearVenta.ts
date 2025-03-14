import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface NuevaVenta {
  fk_id_produccion: number | null;
  cantidad: number;
  precio_unidad: number;
  total_venta: number;
  fecha: string;
}

export const useCrearVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaVenta: NuevaVenta) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { data } = await axios.post(
        `${apiUrl}venta/`, // Ajusta la URL según tu endpoint
        nuevaVenta,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
    },
    onError: (error: any) => {
      console.error("Error al crear la venta:", error.message);
    },
  });
};
