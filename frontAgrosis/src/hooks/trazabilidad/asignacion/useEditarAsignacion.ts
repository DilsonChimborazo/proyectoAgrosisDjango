import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number;
}

// Función para editar una asignación con manejo de errores
const editarAsignacion = async (asignacionData: Asignacion): Promise<Asignacion> => {
  try {
    const { data } = await axios.put(`${apiUrl}asignaciones_actividades/${asignacionData.id}/`, asignacionData);
    return data;
  } catch (error) {
    console.error('Error al editar asignación:', error);
    throw new Error('No se pudo editar la asignación');
  }
};

export const useEditarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, Asignacion>({
    mutationFn: editarAsignacion,
    onSuccess: () => {
      // Invalidar la consulta de asignaciones para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['Asignacion'] });
    },
  });
};