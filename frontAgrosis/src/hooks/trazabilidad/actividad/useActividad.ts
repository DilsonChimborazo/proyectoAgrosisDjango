import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

// Función para obtener las actividades con manejo de errores
const fetchActividades = async (): Promise<Actividad[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}actividad/`);
    return data;
  } catch (error) {
    throw new Error('No se pudo obtener la lista de actividades');
  }
};

export const useActividad = () => {
  return useQuery<Actividad[], Error>({
    queryKey: ['Actividad'],
    queryFn: fetchActividades,
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};