import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion | null;
  fk_id_actividad: Actividad | null;
}

interface Plantacion {
  id: number;
  fk_id_cultivo: Cultivo;
}

interface Cultivo {
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
  fk_id_especie: Especie;
  fk_id_semillero: Semillero;
}

interface Especie {
  nombre_cientifico: string;
  nombre_comun: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

interface TipoCultivo {
  nombre: string;
  descripcion: string;
}

interface Semillero {
  nombre_semillero: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

interface Actividad {
  nombre_actividad: string;
  descripcion: string;
}

// Función para obtener los datos de Realiza con manejo de errores
const fetchRealiza = async (): Promise<Realiza[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}realiza/`);
    return data;
  } catch (error: any) {
    console.error("Error al obtener los datos de realiza:", error.response?.data || error.message);
    throw new Error("No se pudo obtener la lista de realiza");
  }
};

export const useRealiza = () => {
  return useQuery<Realiza[], Error>({
    queryKey: ['Realiza'],
    queryFn: fetchRealiza,
    gcTime: 1000 * 60 * 10,
    retry: 1, // Reduce retries to avoid spamming the server during debugging
  });
};