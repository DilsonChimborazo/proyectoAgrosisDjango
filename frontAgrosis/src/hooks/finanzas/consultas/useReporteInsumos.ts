import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface ReporteEgresos {
  tipo: string; // "Actividad" o "Control Fitosanitario"
  nombre: string; // Nombre de la actividad o la descripción del control fitosanitario
  insumos: string; // Lista de insumos utilizados
  costos: string; // Costos detallados
  total: number; // Costo total
}

const fetchReporteEgresos = async (): Promise<ReporteEgresos[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}insumo/reporte-egresos/`);
    return data.reporte; // Accede a la clave correcta en la respuesta
  } catch (error) {
    console.error("Error al obtener el reporte de egresos:", error);
    throw new Error("No se pudo obtener el reporte");
  }
};

export const useReporteEgresos = () => {
  return useQuery<ReporteEgresos[], Error>({
    queryKey: ["reporteEgresos"],
    queryFn: fetchReporteEgresos,
    staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 10 minutos
  });
};
