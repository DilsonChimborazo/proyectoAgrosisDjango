import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Produccion } from "./useProduccion"; // Importamos la interfaz del hook anterior

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaz para los datos de creación (puede ser diferente a la de listado)
export interface CrearProduccionData {
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible?: number; // Opcional porque puede tener un valor por defecto
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

      // Asegurarnos de que stock_disponible tenga valor si no viene
      const datosEnvio = {
        ...nuevaProduccion,
        stock_disponible: nuevaProduccion.stock_disponible ?? 0,
      };

      const { data } = await axios.post<Produccion>(
        `${apiUrl}produccion/`,
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
      // Invalidar la query de producción para refrescar los datos
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
      // Opcional: También podrías invalidar otras queries relacionadas
      // queryClient.invalidateQueries({ queryKey: ["plantaciones"] });
    },
    onError: (error: Error) => {
      console.error("Error al crear la producción:", error.message);
      // Aquí podrías agregar notificaciones al usuario
    },
  });
};