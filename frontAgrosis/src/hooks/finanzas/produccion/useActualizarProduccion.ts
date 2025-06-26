import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Produccion } from "./useProduccion";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ActualizarProduccionData {
  id_produccion: number;
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible?: number;
  precio_sugerido_venta?: number | null;
  fk_id_plantacion: number | null;
  fk_unidad_medida: number | null;
  cantidad_en_base?: number | null;
}

export const useActualizarProduccion = () => {
  const queryClient = useQueryClient();

  return useMutation<Produccion, Error, ActualizarProduccionData>({
    mutationFn: async (produccionActualizada: ActualizarProduccionData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { id_produccion, ...datos } = produccionActualizada;

      const response = await axios.put<Produccion>(
        `${apiUrl}produccion/${id_produccion}/`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(`Error en la actualización: ${response.statusText}`);
      }

      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
      queryClient.invalidateQueries({ queryKey: ["produccion", variables.id_produccion] });
    },
    onError: (error: Error) => {
      console.error("Error al actualizar la producción:", error.message);
    },
  });
};