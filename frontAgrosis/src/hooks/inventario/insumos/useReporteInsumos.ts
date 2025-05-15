import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface InsumoBajoStock {
  id: number;
  nombre: string;
  tipo: string;
  precio_unidad: string;
  cantidad_en_base: number;
  fk_unidad_medida: UnidadMedida;
}

export interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';  
    factor_conversion: number;
}

export const useReporteInsumos = (umbral: number = 2000) => {
  return useQuery<InsumoBajoStock[]>({
    queryKey: ["reporte_insumos_bajo_stock", umbral],
    queryFn: async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("⚠️ Token de autenticación no encontrado.");
      }

      const { data } = await axios.get(
        `${apiUrl}insumo/reporteBajoStock/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return data;
    },
  });
};
