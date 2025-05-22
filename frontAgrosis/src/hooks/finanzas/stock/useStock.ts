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

export interface ItemVenta {
  id: number;
  venta: {
    id: number;
    fecha: string;
    total: number;
  };
  produccion: Produccion;
  precio_unidad: number;
  cantidad: number;
  unidad_medida: UnidadMedida;
  cantidad_en_base: number;
  subtotal: number;
}

export interface Stock {
  id: number;
  fk_id_produccion: Produccion | null;
  fk_id_item_venta: ItemVenta | null;
  cantidad: number;
  fecha: string;
  movimiento: 'Entrada' | 'Salida';
  venta_info?: {
    venta_id: number;
    fecha_venta: string;
    total_venta: number;
  };
}


// Función para obtener los datos de Stock
const fetchStock = async (): Promise<Stock[]> => {
  try {
    const token = localStorage.getItem('token');
    const { data } = await axios.get(`${apiUrl}stock/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return data;
  } catch (error) {
    console.error("Error fetching stock:", error);
    throw new Error("Error al obtener los movimientos de stock");
  }
};

export const useStock = () => {
  return useQuery<Stock[], Error>({
    queryKey: ['stock'],
    queryFn: fetchStock,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};