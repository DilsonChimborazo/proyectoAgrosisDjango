import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de interfaces para los datos relacionados
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

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Plantacion {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
  cantidad_transplante?: number;
  fk_id_semillero?: Semillero;
  fecha_plantacion: string;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion;
  fk_id_actividad: Actividad;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza;
  fk_identificacion: Usuario;
}

// Interfaz para los datos de entrada (POST)
export interface CrearAsignacionDTO {
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number;
}

// Función para crear una asignación
const crearAsignacion = async (asignacionData: CrearAsignacionDTO): Promise<Asignacion> => {
  try {
    const response = await axios.post(`${apiUrl}asignaciones_actividades/`, asignacionData);
    console.log("Asignación creada exitosamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al crear asignación:", error.response?.data || error.message);
    throw new Error("No se pudo crear la asignación");
  }
};

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, CrearAsignacionDTO>({
    mutationFn: crearAsignacion,
    onSuccess: () => {
      // Invalidar la consulta de asignaciones para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['Asignaciones'] });
    },
  });
};