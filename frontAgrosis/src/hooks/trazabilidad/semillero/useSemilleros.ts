import { useQuery } from '@tanstack/react-query';
import axios from 'axios';



export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number
}

const fetchSemilleros = async (): Promise<Semillero[]> => {
  try {
    const { data } = await axios.get(`/api/semilleros/`);
    return data;
  } catch (error) {
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
