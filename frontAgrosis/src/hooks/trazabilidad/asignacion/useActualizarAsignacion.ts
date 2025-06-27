import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/components/globales/Toast';

const apiUrl = import.meta.env.VITE_API_URL;

interface Asignacion {
  id: number;
  fecha?: string;
  observaciones?: string;
  fk_id_actividad?: number;
  id_identificacion?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada?: string;
  fk_id_realiza?: number | { id: number };
  fk_identificacion?: number | { id: number };
}

// Interfaz para los datos de actualización
interface ActualizarAsignacionDTO {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

const actualizarAsignacion = async (asignacion: ActualizarAsignacionDTO): Promise<Asignacion> => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  if (!asignacion.id) {
    throw new Error('El ID de la asignación es requerido');
  }

  const updateData = { estado: asignacion.estado };

  try {
    const response = await axios.post(
      `${apiUrl}asignaciones_actividades/${asignacion.id}/finalizar/`,
      updateData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data.asignacion || response.data as Asignacion;
  } catch (error: any) {
    let errorMessage = 'No se pudo actualizar la asignación';

    if (error.response?.status === 403) {
      errorMessage = 'No tienes permisos para finalizar esta asignación. Contacta a un administrador.';
    } else if (error.response?.data) {
      if (typeof error.response.data === 'object') {
        const errors = Object.entries(error.response.data)
          .map(([field, messages]) => `${field}: ${Array.isArray(messages) ? messages.join(', ') : messages}`)
          .join('; ');
        errorMessage = errors || errorMessage;
      } else {
        errorMessage = error.response.data.detail || error.response.data.message || errorMessage;
      }
    }

    throw new Error(errorMessage);
  }
};

export const useActualizarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, ActualizarAsignacionDTO>({
    mutationFn: actualizarAsignacion,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Asignaciones'] });
      showToast({
        title: 'Éxito',
        description: 'La asignación se ha actualizado correctamente.',
        timeout: 3000,
        variant: 'success',
      });
    },
    onError: (error: any) => {
      showToast({
        title: 'Error',
        description: error.message || 'Ocurrió un error al actualizar la asignación.',
        timeout: 3000,
        variant: 'error',
      });
    },
  });
};