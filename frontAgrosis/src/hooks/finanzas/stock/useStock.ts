import { useQuery } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';

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
  precio_sugerido_venta: number | null;
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
    descuento_porcentaje: number;
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

const getToken = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }
  return token;
};

const fetchProducciones = async (): Promise<Produccion[]> => {
  try {
    const token = getToken();
    const { data } = await axios.get(`${apiUrl}produccion/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Manejar respuestas paginadas como { results: Produccion[] }
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching producciones:', axiosError.message, axiosError.response?.data);
    throw new Error(`Error al obtener las producciones: ${axiosError.message}`);
  }
};

const fetchStockByProduccion = async (produccionId: number): Promise<Stock[]> => {
  try {
    const token = getToken();
    const { data } = await axios.get(`${apiUrl}stock/?fk_id_produccion=${produccionId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Manejar respuestas paginadas
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching stock by produccion:', axiosError.message, axiosError.response?.data);
    throw new Error(`Error al obtener los movimientos de stock: ${axiosError.message}`);
  }
};

const fetchAllStock = async (): Promise<Stock[]> => {
  try {
    const token = getToken();
    const { data } = await axios.get(`${apiUrl}stock/`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    // Manejar respuestas paginadas
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    const axiosError = error as AxiosError;
    console.error('Error fetching all stock:', axiosError.message, axiosError.response?.data);
    throw new Error(`Error al obtener todos los movimientos de stock: ${axiosError.message}`);
  }
};

export const useProducciones = () => {
  return useQuery<Produccion[], Error>({
    queryKey: ['producciones'],
    queryFn: fetchProducciones,
    staleTime: 1000 * 60 * 5,
    retry: 2, // Reintentar 2 veces en caso de error
  });
};

export const useStockByProduccion = (produccionId: number | null) => {
  return useQuery<Stock[], Error>({
    queryKey: ['stock', produccionId],
    queryFn: () => {
      if (!produccionId) {
        throw new Error('ID de producción no proporcionado');
      }
      return fetchStockByProduccion(produccionId);
    },
    enabled: !!produccionId,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useAllStock = () => {
  return useQuery<Stock[], Error>({
    queryKey: ['allStock'],
    queryFn: fetchAllStock,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};