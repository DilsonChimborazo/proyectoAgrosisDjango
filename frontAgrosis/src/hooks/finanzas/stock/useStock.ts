import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


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

export interface Stock {
  id: number;
  fk_id_produccion: Produccion | null;
  fk_id_venta: Venta | null;
  cantidad: number;
  fecha: string;
  movimiento: 'Entrada' | 'Salida';
}


// Función para obtener los datos de Stock
const fetchStock = async (): Promise<Stock[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}stock/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de stock:", error);
    throw new Error("No se pudo obtener la lista de stock");
  }
};

// Hook para manejar las operaciones con Stock
export const useStock = () => {
  return useQuery<Stock[], Error>({
    queryKey: ['stock'],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 10,  // 10 minutos
  });
};
