import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;




// Definimos la interfaz actualizada para NuevaVenta
export interface NuevaVenta {
  fk_id_produccion: number;
  cantidad: number;
  precio_unidad: number;
  fecha: string;
  fk_unidad_medida: number; // Ya no es opcional
  cantidad_en_base: number; // Campo calculado
}

export const useCrearVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaVenta: NuevaVenta) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      try {
        const { data } = await axios.post(
          `${apiUrl}venta/`, 
          nuevaVenta,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        return data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message || 
            "Error al crear la venta"
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["producciones"] }); // Añadido para actualizar stock
    },
    onError: (error: Error) => {
      console.error("Error al crear la venta:", error.message);
    },
  });
};

// Definimos la interfaz Venta actualizada
