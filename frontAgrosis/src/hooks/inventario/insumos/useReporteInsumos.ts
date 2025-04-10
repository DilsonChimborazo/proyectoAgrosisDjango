import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface InsumoBajoStock {
  id: number;
  nombre: string;
  tipo: string;
  precio_unidad: string;
  stock: number;
  unidad_medida: string;
}

export const useReporteInsumos = (umbral: number = 500) => {
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
