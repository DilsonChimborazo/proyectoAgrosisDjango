import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
  id_produccion: number;
  cantidad_produccion: number;
  fecha: string;
}

const fetchProduccion = async (): Promise<Produccion[]> => {
  try {
      const { data } = await axios.get(`${apiUrl}produccion/`);
      return data;
  } catch (error) {
      console.error("Error al obtener la produccion:", error);
      throw new Error("No se pudo obtener la lista de la produccion");
  }
};

export const useProduccion = () => {
  return useQuery<Produccion[], Error>({
      queryKey: ['produccion'],
      queryFn: fetchProduccion,
      staleTime: 1000 * 60 * 10,
  });
};

