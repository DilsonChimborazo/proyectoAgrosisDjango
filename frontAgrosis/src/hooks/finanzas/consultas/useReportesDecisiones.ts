import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TrazabilidadCultivoReporte } from '@/components/finanzas/trazabilidad/Types';


const apiUrl = import.meta.env.VITE_API_URL;

const fetchTrazabilidadCompleta = async (plantacionId: number) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}trazabilidad/plantacion/${plantacionId}/`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return data;
};

export const useReportesDecisiones = (plantacionId: number) => {
  return useQuery<TrazabilidadCultivoReporte>({
    queryKey: ["reporteDecisiones", plantacionId],
    queryFn: () => fetchTrazabilidadCompleta(plantacionId),
    staleTime: 1000 * 60 * 5 // 5 minutos
  });
};