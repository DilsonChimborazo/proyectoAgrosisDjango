import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface ReporteAsignacion {
  fecha_programada: string;
  plantacion: string;
  usuario: string;
  actividad: string;
  estado: string;
  observaciones: string;
}

const fetchReporteAsignaciones = async (): Promise<ReporteAsignacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}asignaciones_actividades/reporte-asignaciones/`);
    return data.reporte;
  } catch (error) {
    console.error('Error al obtener el reporte de asignaciones:', error);
    throw new Error('No se pudo obtener el reporte');
  }
};

export const useReporteAsignaciones = () => {
  return useQuery<ReporteAsignacion[], Error>({
    queryKey: ['reporteAsignaciones'],
    queryFn: fetchReporteAsignaciones,
    gcTime: 1000 * 60 * 10, // 10 minutos
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};