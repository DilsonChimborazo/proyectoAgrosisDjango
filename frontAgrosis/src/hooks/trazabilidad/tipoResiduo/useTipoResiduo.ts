import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoResiduo {
  id: number;
  nombre: string;
  descripcion: string;
}

const fetchTiposResiduos = async (): Promise<TipoResiduo[]> => {
  try {
   // const token = localStorage.getItem("token");
    const { data } = await axios.get(`${apiUrl}tipo_residuos/`, {
      headers: {
        //Authorization: `Bearer ${token}`,
      },
    });
    console.log("Datos de tipos de residuos:", data); // Para depuración
    return data;
  } catch (error) {
    console.error("Error al obtener tipos de residuos:", error);
    throw new Error("No se pudo obtener la lista de tipos de residuos");
  }
};

export const useTiposResiduos = () => {
  return useQuery<TipoResiduo[], Error>({
    queryKey: ['tipo_residuos'],
    queryFn: fetchTiposResiduos,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};