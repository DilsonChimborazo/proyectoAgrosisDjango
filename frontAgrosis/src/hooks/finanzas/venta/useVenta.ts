import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios, { AxiosError } from 'axios';
import { useNavigate } from 'react-router-dom';

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

export interface CrearItemVenta {
  produccion: number;
  cantidad: number;
  precio_unidad: number;
  unidad_medida: number;
  descuento_porcentaje?: number;
}

export interface ItemVenta {
  id: number;
  produccion: Produccion;
  precio_unidad: number;
  precio_unidad_con_descuento: number;
  cantidad: number;
  unidad_medida: UnidadMedida;
  cantidad_en_base: number;
  subtotal: number;
  descuento_porcentaje: number;
}

export interface UsuarioVenta {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface CrearVentaData {
  items: CrearItemVenta[];
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  items: ItemVenta[];
  completada?: boolean;
  usuario?: UsuarioVenta;
}

const api = axios.create({
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

interface AxiosErrorData {
  message?: string;
}

const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const { data } = await api.get('/ventas/');
    return Array.isArray(data) ? data : data.results || [];
  } catch (error) {
    const axiosError = error as AxiosError<AxiosErrorData>;
    throw new Error(axiosError.response?.data?.message || 'Error al obtener ventas');
  }
};

const fetchVenta = async (id: number): Promise<Venta> => {
  try {
    const { data } = await api.get(`/ventas/${id}/`);
    return data;
  } catch (error) {
    const axiosError = error as AxiosError<AxiosErrorData>;
    throw new Error(axiosError.response?.data?.message || 'Error al obtener la venta');
  }
};

export const useCrearVenta = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (ventaData: CrearVentaData) => {
      const response = await api.post('/ventas/', ventaData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['producciones'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
      navigate('/stock');
    },
    onError: (error: Error) => {
      console.error('Error al crear la venta:', error.message);
    },
  });
};

export const useActualizarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ventaData }: { id: number; ventaData: Partial<CrearVentaData> }) => {
      const response = await api.patch(`/ventas/${id}/`, ventaData);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ventas'] });
      queryClient.invalidateQueries({ queryKey: ['producciones'] });
      queryClient.invalidateQueries({ queryKey: ['stock'] });
    },
  });
};

export const useVentas = () => {
  return useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: fetchVentas,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};

export const useVenta = (id: number) => {
  return useQuery<Venta, Error>({
    queryKey: ['venta', id],
    queryFn: () => fetchVenta(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};