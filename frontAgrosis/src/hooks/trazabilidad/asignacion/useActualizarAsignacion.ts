import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000/api/';

// Interfaz para los datos de actualización de asignación
interface ActualizarAsignacionDTO {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

// Función para actualizar una asignación
const actualizarAsignacion = async (asignacionData: ActualizarAsignacionDTO) => {
  const response = await axios.patch(`${apiUrl}asignaciones_actividades/${asignacionData.id}/`, {
    estado: asignacionData.estado,
  });
  return response.data;
};

// Hook para actualizar una asignación
export const useActualizarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: actualizarAsignacion,
    onSuccess: () => {
      // Invalidar las consultas de asignaciones para actualizar la tabla
      queryClient.invalidateQueries({ queryKey: ['Asignaciones'] });
    },
    onError: (error: any) => {
      console.error('Error al actualizar asignación:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'No se pudo actualizar la asignación');
    },
  });
};