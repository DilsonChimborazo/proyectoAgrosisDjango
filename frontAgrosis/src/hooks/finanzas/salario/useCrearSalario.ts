import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface CrearSalarioPayload {
  fk_id_rol: number;
  precio_jornal: number;
  horas_por_jornal: number;
  activo: boolean;
  fecha_inicio?: string; // Opcional
}

export const useCrearSalario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoSalario: CrearSalarioPayload) => {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No se ha encontrado un token de autenticación");

      const response = await axios.post(`${apiUrl}salario/`, nuevoSalario, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salario"] });
    },
    onError: (error: any) => {
      console.error("Error al crear salario:", {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      throw error;
    },
  });
};