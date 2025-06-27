import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo | number;
}

interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
}

const fetchEspecie = async (): Promise<Especie[]> => {
  try {
    const { data} = await axios.get(`${apiUrl}especies/`);
    if (!Array.isArray(data)) {
      throw new Error("La respuesta del API no es una lista de especies");
    }
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.message || "No se pudo obtener la lista de especies";
    throw new Error(errorMessage);
  }
};

export const useEspecie = () => {
  return useQuery<Especie[], Error>({
    queryKey: ['especies'],
    queryFn: fetchEspecie,
    staleTime: 1000 * 60 * 5,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};