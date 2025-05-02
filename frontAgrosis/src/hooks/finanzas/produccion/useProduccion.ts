import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces basadas en tus modelos Django
export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
    
}

export interface Eras {
    id: number;
    descripcion: string;
    fk_id_lote: Lote | null;
    estado: boolean;
}

export interface Semillero {
    id: number;
    nombre_semilla: string;
    fecha_siembra: string; 
    fecha_estimada: string;
    cantidad: number;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    
}

export interface Plantacion {
    id: number;
    fk_id_eras: Eras | null;
    fk_id_cultivo: Cultivo | null;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: Semillero | null;
}

export interface Produccion {
  id: number;
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible: number;
  fk_id_plantacion: Plantacion | null;
  fk_unidad_medida: UnidadMedida | null;
  cantidad_en_base: number | null;
}

// Función para obtener la lista de producción
const fetchProduccion = async (): Promise<Produccion[]> => {
  try {
    const { data } = await axios.get<Produccion[]>(`${apiUrl}produccion/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de producción:", error);
    throw new Error("No se pudo obtener la lista de producción");
  }
};

// Hook para usar en los componentes
export const useProduccion = () => {
  return useQuery<Produccion[], Error>({
    queryKey: ['produccion'],
    queryFn: fetchProduccion,
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  });
};