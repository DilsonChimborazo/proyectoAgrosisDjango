import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/components/globales/Toast';

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
  fk_id_realiza: Realiza | number;
  fk_identificacion: number[];
}

// Interfaz para los datos de entrada (POST)
export interface CrearAsignacionDTO {
  estado: 'Pendiente'; // Solo 'Pendiente' al crear
  fecha_programada: string; // Formato ISO (YYYY-MM-DD)
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number[]; // Array de IDs de usuarios (sin restricción de roles)
}

// Función para crear una asignación con validación y depuración
const crearAsignacion = async (asignacionData: CrearAsignacionDTO): Promise<Asignacion> => {
  try {
    // Validación básica en el frontend
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

    // Depuración: Mostrar datos enviados con detalle
    console.log('Datos enviados a crearAsignacion:', JSON.stringify(asignacionData, null, 2));

    const response = await axios.post(`${apiUrl}asignaciones_actividades/`, asignacionData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log('Respuesta del backend:', JSON.stringify(response.data, null, 2));
    return response.data;
  } catch (error: any) {
    // Mejor manejo de errores para capturar detalles específicos
    const errorDetails = error.response?.data || error.message;
    let errorMessage = 'No se pudo crear la asignación';

    if (error.response?.data) {
      if (typeof error.response.data === 'object') {
        // Si el backend devuelve un objeto con errores por campo
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        errorMessage = errors || errorMessage;
      } else {
        errorMessage = error.response.data.detail || error.response.data.message || errorMessage;
      }
    }

    console.error('Error detallado al crear asignación:', errorMessage, errorDetails);
    throw new Error(errorMessage);
  }
};

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, CrearAsignacionDTO>({
    mutationFn: crearAsignacion,
    onSuccess: () => {
      // Invalidar la consulta de asignaciones para recargar la lista
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
        timeout: 5000, // Aumentar el tiempo para errores para que el usuario pueda leerlos
        variant: 'error',
      });
    },
  });
};