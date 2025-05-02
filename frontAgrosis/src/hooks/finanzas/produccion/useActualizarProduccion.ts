import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Produccion } from "./useProduccion"; // Importamos la interfaz del listado

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaz para los datos de actualización
export interface ActualizarProduccionData {
  id_produccion: number;
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible?: number;
  fk_id_plantacion: number | null;
  fk_unidad_medida: number | null;
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

      const { data } = await axios.put<Produccion>(
        `${apiUrl}produccion/${id_produccion}/`,
        datos,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return data;
    },
    onSuccess: (_data, variables) => {
      // Invalida tanto la lista general como el detalle específico
      queryClient.invalidateQueries({ queryKey: ["produccion"] });
      queryClient.invalidateQueries({ 
        queryKey: ["produccion", variables.id_produccion] 
      });
      
      // Opcional: Invalida queries relacionadas si es necesario
      // queryClient.invalidateQueries({ queryKey: ["plantaciones"] });
    },
    onError: (error: Error) => {
      console.error("Error al actualizar la producción:", error.message);
      // Aquí podrías agregar notificaciones al usuario
    },
  });
};