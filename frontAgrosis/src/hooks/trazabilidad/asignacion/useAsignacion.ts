// src/hooks/trazabilidad/asignacion/useAsignacion.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Rol{
  id: number;
  rol: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fk_id_rol: Rol
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
  fk_identificacion:number[]; // Cambiado a number[] para ManyToManyField
}

// Configurar el interceptor de Axios para incluir el token de autenticación
const getAuthToken = () => {
  return localStorage.getItem('token') || null; // Ajusta según dónde almacenes el token
};

axios.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Incluye el token en todas las solicitudes
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Función para obtener las asignaciones
const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}asignaciones_actividades/`);
    return data;
  } catch (error: any) {
    console.error('Error al obtener asignaciones:', error.response?.data || error.message);
    throw new Error('No se pudo obtener la lista de asignaciones');
  }
};

// Función para finalizar una asignación
export const finalizarAsignacion = async (id: number): Promise<Asignacion> => {
  try {
    const { data } = await axios.post(`${apiUrl}asignaciones_actividades/${id}/finalizar/`);
    return data.asignacion; // El backend devuelve la asignación actualizada en 'asignacion'
  } catch (error: any) {
    console.error('Error al finalizar asignación:', error.response?.data || error.message);
    throw new Error(error.response?.data?.error || 'No se pudo finalizar la asignación');
  }
};

// Hook para obtener las asignaciones
export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['Asignaciones'],
    queryFn: fetchAsignaciones,
    gcTime: 1000 * 60 * 10, // 10 minutos
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};