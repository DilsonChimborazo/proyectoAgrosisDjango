import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/components/globales/Toast';

const apiUrl = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/';

// Reusing interfaces from the first snippet for consistency
export interface Rol {
  id: number;
  rol: string;
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

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo: Cultivo;
  cantidad_transplante?: number;
  fk_id_semillero: Semillero;
  fecha_plantacion: string;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion;
  fk_id_actividad: Actividad;
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

export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza | number;
  fk_identificacion: number[];
}

export interface CrearAsignacionDTO {
  estado: 'Pendiente';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number[];
}

const crearAsignacion = async (asignacionData: CrearAsignacionDTO): Promise<Asignacion> => {
  try {
    // Basic frontend validation
    if (!asignacionData.fecha_programada || !/^\d{4}-\d{2}-\d{2}$/.test(asignacionData.fecha_programada)) {
      throw new Error('La fecha programada debe estar en formato YYYY-MM-DD (ejemplo: 2025-06-05)');
    }
    if (!asignacionData.fk_id_realiza || asignacionData.fk_id_realiza <= 0) {
      throw new Error('El ID de realiza es inválido');
    }
    if (!asignacionData.fk_identificacion || asignacionData.fk_identificacion.length === 0) {
      throw new Error('Debe asignar al menos un usuario');
    }
    if (asignacionData.fk_identificacion.some(id => id <= 0 || !Number.isInteger(id))) {
      throw new Error('Los IDs de usuarios en fk_identificacion deben ser enteros válidos y mayores que cero');
    }

    // Log request data for debugging
    console.log('Enviando datos para crear asignación:', JSON.stringify(asignacionData, null, 2));

    // Make POST request
    const { data } = await axios.post(`${apiUrl}asignaciones_actividades/`, asignacionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Log raw response for debugging
    console.log('Respuesta cruda del backend:', JSON.stringify(data, null, 2));

    // Handle both direct Asignacion and wrapped { asignacion: Asignacion } responses
    const asignacion = data.asignacion || data;

    // Validate the response structure
    if (!asignacion || typeof asignacion !== 'object' || !asignacion.id) {
      throw new Error('La API no devolvió una asignación válida.');
    }

    return asignacion as Asignacion;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.detail ||
      error.response?.data?.error ||
      error.message ||
      'No se pudo crear la asignación';
    console.error('Error al crear asignación:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      stack: error.stack,
    });
    throw new Error(errorMessage);
  }
};

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, CrearAsignacionDTO>({
    mutationFn: crearAsignacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Asignaciones'] });
      showToast({
        title: 'Éxito',
        description: 'La asignación se ha creado correctamente.',
        timeout: 3000,
        variant: 'success',
      });
    },
    onError: (error) => {
      showToast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al crear la asignación.',
        timeout: 5000,
        variant: 'error',
      });
    },
  });
};