import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

export interface Rol {
  id: number;
  rol: string;
}

export interface Usuario {
  id: number;
  identificacion: string;
  email: string;
  nombre: string;
  apellido: string;
  is_active: boolean;
  fk_id_rol: Rol | null;
  ficha: Ficha | null;
  img: string | null;
  img_url: string;
}

export interface Ficha {
  id: number;
  numero_ficha: number;
  nombre_ficha: string;
  abreviacion: string;
  fecha_inicio: string;
  fecha_salida: string;
  is_active: boolean;
}

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
  ciclo_duracion?: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
}

export interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo: Cultivo;
  cantidad_transplante?: number;
  fk_id_semillero: Semillero;
  fecha_plantacion: string;
}

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Lote {
  id: number;
  nombre_lote: string;
  dimencion: string;
  estado: boolean;
}

export interface Eras {
  id: number;
  descripcion: string;
  fk_id_lote: Lote;
  estado: boolean;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion;
  fk_id_actividad: Actividad;
}

export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza | number;
  fk_identificacion: (number | { id: number })[];
}

const getAuthToken = () => {
  return localStorage.getItem('token') || null;
};

axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}asignaciones_actividades/`);
    if (!Array.isArray(data)) {
      throw new Error('La API no devolvió un array válido.');
    }
    return data;
  } catch (error: any) {
    const errorMessage = error.response?.data?.detail || error.message || 'No se pudo obtener la lista de asignaciones';
    console.error('Error al obtener asignaciones:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(errorMessage);
  }
};

export const finalizarAsignacion = async (id: number): Promise<Asignacion> => {
  try {
    const { data } = await axios.post(`${apiUrl}asignaciones_actividades/${id}/finalizar/`);
    return data.asignacion;
  } catch (error: any) {
    const errorMessage = error.response?.data?.error || error.message || 'No se pudo finalizar la asignación';
    console.error('Error al finalizar asignación:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    throw new Error(errorMessage);
  }
};

export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['Asignaciones'],
    queryFn: fetchAsignaciones,
    gcTime: 1000 * 60 * 10,
    staleTime: 1000 * 60 * 5,
    retry: 2,
  });
};