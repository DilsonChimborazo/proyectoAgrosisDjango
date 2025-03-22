import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


export interface Semillero {
  id: number;
  nombre_semillero: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

const fetchSemilleros = async (): Promise<Semillero[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}semilleros/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los semilleros:", error);
    throw new Error("No se pudo obtener los semilleros");
  }
};

export const useSemilleros = () => {
  return useQuery<Semillero[], Error>({
    queryKey: ['Semilleros'],
    queryFn: fetchSemilleros,
    gcTime: 1000 * 60 * 10, // El tiempo de garbage collection
  });
};
