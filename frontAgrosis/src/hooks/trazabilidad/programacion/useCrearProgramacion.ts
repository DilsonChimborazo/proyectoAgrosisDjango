import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: number;
  cantidad_insumo?: number;
  img?: string;
  fk_unidad_medida?: number;
  estado: "Pendiente" | "Completada" | "Cancelada" | "Reprogramada";
}

export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaProgramacion: FormData) => {
      console.log("🚀 Datos enviados al backend:", nuevaProgramacion);
      const response = await axios.post(`${apiUrl}programaciones/`, nuevaProgramacion, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("📩 Respuesta del backend:", response.data);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("✅ Programación creada con éxito, datos retornados:", data);
      queryClient.invalidateQueries({ queryKey: ["programaciones"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al crear programación:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
      });
    },
  });
};