import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: number;
}

export interface Semillero {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Cultivo {
  id_cultivo: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: number;
  fk_id_semillero: number;
}

export interface Produccion {
  id_produccion: number;
  fk_id_cultivo: number;
  cantidad_produccion: number;
  fecha: string;
}

export interface Genera {
  id_genera: number;
  fk_id_cultivo: Cultivo | null;
  fk_id_produccion: Produccion | null; 
}

const fetchGenera = async (): Promise<Genera[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}genera/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de genera:", error);
    throw new Error("No se pudo obtener la lista de genera");
  }
};

export const useGenera = () => {
  return useQuery<Genera[], Error>({
    queryKey: ['genera'],
    queryFn: fetchGenera,
    staleTime: 1000 * 60 * 10,
  });
};