import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaz para Ubicacion
export interface Ubicacion {
  id: number;
  latitud: number;
  longitud: number;
}

// Función para obtener las ubicaciones desde la API
const fetchUbicaciones = async (): Promise<Ubicacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}ubicacion/`); // Ajusta la ruta según tu API
    return data;
  } catch (error) {
    console.error("Error al obtener las ubicaciones:", error);
    throw new Error("No se pudo obtener la lista de ubicaciones");
  }
};

// Hook para usar las ubicaciones
export const useUbicaciones = () => {
  return useQuery<Ubicacion[], Error>({
    queryKey: ['ubicaciones'],
    queryFn: fetchUbicaciones,
    staleTime: 1000 * 60 * 10, // 10 minutos de tiempo de stale
  });
};