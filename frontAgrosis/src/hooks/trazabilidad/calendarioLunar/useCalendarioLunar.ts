import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface CalendarioLunar {
  id: number;
  fecha: string;
  descripcion_evento: string;
  evento: string;
}

const fetchCalendarioLunar = async (): Promise<CalendarioLunar[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}calendario_lunar/`);
    return data;
  } catch (error) {
    console.error("Error al obtener el calendario lunar:", error);
    throw new Error("No se pudo obtener el calendario lunar");
  }
};

export const useCalendarioLunar = () => {
  return useQuery<CalendarioLunar[], Error>({
    queryKey: ['CalendarioLunar'],
    queryFn: fetchCalendarioLunar,
    gcTime: 1000 * 60 * 10,
  });
};
