import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces para los modelos
export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

export interface Produccion {
  id: number;
  nombre_produccion: string;
  cantidad_producida: number;
  fecha: string;
  stock_disponible: number;
  precio_sugerido_venta: number | null; 
  fk_unidad_medida: UnidadMedida;
  cantidad_en_base: number;
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

export interface CrearVentaData {
  items: CrearItemVenta[];
}

export interface Venta {
  id: number;
  fecha: string;
  total: number;
  items: ItemVenta[];
  completada?: boolean;
}

// Crear una instancia de axios con configuración base
const api = axios.create({
  baseURL: apiUrl,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para agregar el token a cada solicitud
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Obtener todas las ventas
const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const response = await api.get('/ventas/');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 401) {
        console.error('Token expirado o inválido');
      }
      throw new Error(error.response?.data?.message || 'Error al obtener ventas');
    }
    throw new Error('Error desconocido al obtener ventas');
  }
};

// Crear una nueva venta
export const useCrearVenta = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (ventaData: CrearVentaData) => {
      try {
        const response = await api.post('/ventas/', ventaData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
            'Error al crear la venta'
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
      navigate("/stock");
    },
    onError: (error: Error) => {
      console.error("Error al crear la venta:", error.message);
    },
  });
};

// Obtener una venta específica
const fetchVenta = async (id: number): Promise<Venta> => {
  try {
    const response = await api.get(`/ventas/${id}/`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(
        error.response?.data?.message ||
        'Error al obtener la venta'
      );
    }
    throw new Error('Error desconocido al obtener la venta');
  }
};

// Actualizar una venta
export const useActualizarVenta = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ventaData }: { id: number, ventaData: Partial<CrearVentaData> }) => {
      try {
        const response = await api.patch(`/ventas/${id}/`, ventaData);
        return response.data;
      } catch (error) {
        if (axios.isAxiosError(error)) {
          throw new Error(
            error.response?.data?.message ||
            'Error al actualizar la venta'
          );
        }
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ventas"] });
      queryClient.invalidateQueries({ queryKey: ["producciones"] });
      queryClient.invalidateQueries({ queryKey: ["stock"] });
    },
  });
};

// Exportar los hooks como antes
export const useVentas = () => {
  return useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: fetchVentas,
    staleTime: 1000 * 60 * 5,
  });
};

export const useVenta = (id: number) => {
  return useQuery<Venta, Error>({
    queryKey: ['venta', id],
    queryFn: () => fetchVenta(id),
  });
};