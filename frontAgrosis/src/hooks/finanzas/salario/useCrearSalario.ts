import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaz para los datos de creación (puede ser diferente a la de listado)
export interface CrearSalarioData {
  id: number;
  fk_id_rol: number;
  precio_jornal: number;
  horas_por_jornal: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;

}

export const useCrearSalario = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoSalario: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { data } = await axios.post(`${apiUrl}salario/`, nuevoSalario, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess: () => {
      console.log("✅ Insumo creado con éxito");
      queryClient.invalidateQueries({ queryKey: ["salario"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al crear el insumo:", error.response?.data || error.message);
    },
  });
};
