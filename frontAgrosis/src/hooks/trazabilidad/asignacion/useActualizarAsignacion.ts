import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

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

const actualizarAsignacion = async (asignacion: Partial<Asignacion>) => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No se encontró el token de autenticación');
  }

  if (!asignacion.id) {
    throw new Error('El ID de la asignación es requerido');
  }

  const { id, ...updateData } = asignacion;

  // Convertir estado a minúsculas
  if (updateData.estado) {
    
  }

  console.log('Datos enviados al backend:', updateData); // Para depuración

  const response = await axios.patch(`${apiUrl}asignaciones_actividades/${id}/`, updateData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return response.data as Asignacion;
};

export const useActualizarAsignacion = () => {
  return useMutation({
    mutationFn: actualizarAsignacion,
    onError: (error: any) => {
      console.error('Error al actualizar asignación:', error.response?.data || error.message);
    },
    onSuccess: (data: Asignacion) => {
      console.log('Asignación actualizada exitosamente:', data);
    },
  });
};