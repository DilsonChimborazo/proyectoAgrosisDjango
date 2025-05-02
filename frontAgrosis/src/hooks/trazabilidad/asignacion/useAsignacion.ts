import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces para los datos que devuelve la API (GET)
export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza;
  fk_identificacion: Usuario;
}

export interface Realiza {
  id: number;
  fk_id_cultivo: Cultivo;
  fk_id_actividad: Actividad;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  fecha_plantacion: string;
  descripcion: string;
  fk_id_especie: Especie;
  fk_id_semillero: Semillero;
}

export interface Especie {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Semillero {
  id: number;
  nombre_semillero: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

// Tipo para los datos enviados al crear una asignación (POST)
export interface CrearAsignacionDTO {
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number;
}

const fetchAsignaciones = async (): Promise<Asignacion[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}asignaciones_actividades/`);
    return data;
  } catch (error) {
    console.error('Error al obtener las asignaciones:', error);
    throw new Error('No se pudo obtener la lista de asignaciones');
  }
};

export const useAsignacion = () => {
  return useQuery<Asignacion[], Error>({
    queryKey: ['Asignaciones'],
    queryFn: fetchAsignaciones,
    gcTime: 1000 * 60 * 10, // 10 minutos
  });
};