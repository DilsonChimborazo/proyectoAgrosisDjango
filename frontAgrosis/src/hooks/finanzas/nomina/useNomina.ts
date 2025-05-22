import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface PagoUsuario {
  usuario_id: number;
  usuario_nombre: string;
  usuario_apellido: string;
  actividad: string;
  total_pagado: number;
  cantidad_actividades: number;
}

export interface PagoActividad {
  actividad: string;
  actividad_tipo: string;
  total_pagado: number;
  cantidad: number;
}

export interface PagoDetallado {
  id?: number;
  fecha_pago?: string | null;
  pagado?: boolean;
  pago_total?: number | null;
  actividad?: string | null;
  tipo_actividad?: string | null;
  usuarios?: Array<{
    id?: number;
    nombre?: string | null;
    apellido?: string | null;
  }> | null;
  salario?: {
    jornal?: number | null;
    horas_por_jornal?: number | null;
  } | null;
}

export interface FiltrosPagos {
  fecha_inicio?: string;
  fecha_fin?: string;
  usuario_id?: number;
  estado?: 'pagado' | 'pendiente' | 'todos';
  tipo?: 'programacion' | 'control' | 'todos';
}

// Pagos por usuario
export const usePagosPorUsuario = (filtros?: FiltrosPagos) => {
  return useQuery<PagoUsuario[], Error>({
    queryKey: ['pagos-usuario', filtros],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros?.usuario_id) params.append('usuario_id', filtros.usuario_id.toString());
      if (filtros?.estado && filtros.estado !== 'todos') {
        params.append('pagado', filtros.estado === 'pagado' ? 'true' : 'false');
      }

      const { data } = await axios.get(`${apiUrl}nomina/reporte-por-persona?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    },
    staleTime: 1000 * 60 * 5,
  });
};

// Pagos por actividad
export const usePagosPorActividad = () => {
  return useQuery<PagoActividad[], Error>({
    queryKey: ['pagos-actividad'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const { data } = await axios.get(`${apiUrl}nomina/reporte-por-actividad/`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    }
  });
};

// Pagos detallados
export const usePagosDetallados = (filtros?: FiltrosPagos) => {
  return useQuery<PagoDetallado[], Error>({
    queryKey: ['pagos-detallados', filtros],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (filtros?.fecha_inicio) params.append('fecha_inicio', filtros.fecha_inicio);
      if (filtros?.fecha_fin) params.append('fecha_fin', filtros.fecha_fin);
      if (filtros?.usuario_id) params.append('usuario_id', filtros.usuario_id.toString());
      if (filtros?.estado && filtros.estado !== 'todos') {
        params.append('pagado', filtros.estado === 'pagado' ? 'true' : 'false');
      }

      const { data } = await axios.get(`${apiUrl}nomina/reporte-detallado?${params.toString()}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return data;
    }
  });
};

// Marcar pago como pagado
export const useMarcarPago = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem('token');
      const url = `${apiUrl}nomina/${id}/marcar-pagado/`;

      console.log('Enviando PATCH a:', url);

      const response = await axios.patch(url, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      });

      return response.data;
    },
    onError: (error) => {
      if (axios.isAxiosError(error)) {
        console.error('Error en PATCH:', {
          URL: error.config?.url,
          Método: error.config?.method,
          Respuesta: error.response?.data
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pagos-detallados'] });
      queryClient.invalidateQueries({ queryKey: ['pagos-usuario'] });
      queryClient.invalidateQueries({ queryKey: ['pagos-actividad'] });
    }
  });
};
