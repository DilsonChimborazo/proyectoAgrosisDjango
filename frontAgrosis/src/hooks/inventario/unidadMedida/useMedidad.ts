// src/hooks/inventario/unidadMedida/useMedidas.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

const fetchUnidades = async (): Promise<UnidadMedida[]> => {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`/api/unidad_medida/`, {
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
