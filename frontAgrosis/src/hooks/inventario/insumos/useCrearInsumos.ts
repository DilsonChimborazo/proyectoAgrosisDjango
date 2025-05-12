import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface UnidadMedida {
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';  
  factor_conversion: number;
}
export interface Insumo {
  id: number;
  nombre: string;
  tipo: string;
  precio_unidad: number;
  cantidad_insumo: number;
  fecha_vencimiento: string;
  img?: File | null;
  fk_unidad_medida: UnidadMedida;
}

export const useCrearInsumo = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevoInsumo: FormData) => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No se ha encontrado un token de autenticación");
      }

      const { data } = await axios.post(`${apiUrl}insumo/`, nuevoInsumo, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["insumo"] });
    },
    onError: (error: any) => {
      console.error("❌ Error al crear el insumo:", error.response?.data || error.message);
    },
  });
};
