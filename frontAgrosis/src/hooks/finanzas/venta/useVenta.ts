import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces necesarias para Venta
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

export interface Venta {
  id: number;
  fk_id_produccion: Produccion | null;
  fk_unidad_medida: UnidadMedida | null;
  cantidad: number;
  precio_unidad: number;
  fecha: string;
  cantidad_en_base: number | null;
}

const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const { data } = await axios.get<Venta[]>(`${apiUrl}venta/`);
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener los datos de venta:", error.response?.data);
      throw new Error(error.response?.data?.message || "No se pudo obtener la lista de ventas");
    }
    console.error("Error desconocido al obtener ventas:", error);
    throw new Error("Error desconocido al obtener la lista de ventas");
  }
};

export const useVenta = () => {
  return useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: fetchVentas,
    staleTime: 1000 * 60 * 10, // 10 minutos
  });
};