import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  abreviatura: string;
}

const fetchUnidades = async (): Promise<UnidadMedida[]> => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${apiUrl}unidad_medida/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

export const useMedidas = () => {
  return useQuery<UnidadMedida[], Error>({
    queryKey: ['unidad_medida'],
    queryFn: fetchUnidades,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
