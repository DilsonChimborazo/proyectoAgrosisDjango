import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Produccion } from "./useProduccion";


export interface CrearProduccionData {
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible?: number;
  precio_sugerido_venta?: number | null;
  fk_id_plantacion: number | null;
  fk_unidad_medida: number | null;
}

export const useCrearProduccion = () => {
  const queryClient = useQueryClient();

  return useMutation<Produccion, Error, CrearProduccionData>({
    mutationFn: async (nuevaProduccion: CrearProduccionData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const datosEnvio = {
        ...nuevaProduccion,
        stock_disponible: nuevaProduccion.stock_disponible ?? 0,
      };

      const { data } = await axios.post<Produccion>(
        `/api/produccion/`,
        datosEnvio,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
    onError: (error: Error) => {
      console.error("Error al crear la producción:", error.message);
    },
  });
};