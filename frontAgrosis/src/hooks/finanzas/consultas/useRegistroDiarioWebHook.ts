import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface ReporteProgramacion {
  fk_id_asignacionActividades__fk_id_actividad__nombre_actividad: string;
  total: number;
  [key: string]: number | string; // Para los días del mes dinámicos
}

const fetchReporteProgramacion = async (year: number, month: number): Promise<ReporteProgramacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}programaciones/reporte-detallado/`, {
      params: { year, month }
    });
    return data;
  } catch (error) {
    console.error("Error al obtener el reporte de programación:", error);
    throw new Error("No se pudo obtener el reporte");
  }
};

export const useReporteProgramacion = (year: number, month: number) => {
  return useQuery<ReporteProgramacion[], Error>({
    queryKey: ['reporteProgramacion', year, month],
    queryFn: () => fetchReporteProgramacion(year, month),
    staleTime: 1000 * 60 * 10,
  });
};
