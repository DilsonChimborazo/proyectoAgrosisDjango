import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semilleros {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

// Función para obtener los semilleros con manejo de errores
const fetchSemillero = async (): Promise<Semilleros[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}semilleros/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los semilleros:", error);
    throw new Error("No se pudo obtener la lista de semilleros");
  }
};

export const useSemilleros = () => {
  return useQuery<Semilleros[], Error>({
    queryKey: ['Semilleros'],
    queryFn: fetchSemillero,
    gcTime: 1000 * 60 * 10,
  });
};
