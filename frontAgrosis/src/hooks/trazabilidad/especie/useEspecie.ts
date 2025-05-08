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
    console.log("📞 Fetching especies from API:", `${apiUrl}especies/`);
    const { data, status, headers } = await axios.get(`${apiUrl}especies/`);
    console.log("📩 API response for especies:", { data, status, headers });
    if (!Array.isArray(data)) {
      console.error("⚠️ API response is not an array:", data);
      throw new Error("La respuesta del API no es una lista de especies");
    }
    return data;
  } catch (error: any) {
    console.error("❌ Error al obtener las especies:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
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