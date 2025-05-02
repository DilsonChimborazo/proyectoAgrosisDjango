import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de la interfaz para los datos de la asignación
export interface Asignacion {
  id?: number; // El id será opcional para la creación, ya que lo genera el backend
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number;
}

// Interfaz para los datos de entrada (sin id, ya que es creación)
interface CrearAsignacionDTO {
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
    return response.data;
  } catch (error) {
    console.error('Error al crear asignación:', error);
    throw new Error('No se pudo crear la asignación');
  }
};

export const useCrearAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, CrearAsignacionDTO>({
    mutationFn: crearAsignacion,
    onSuccess: () => {
      // Invalidar la consulta de asignaciones para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['Asignacion'] });
    },
  });
};