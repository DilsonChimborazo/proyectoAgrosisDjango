import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

// Función para crear una actividad con manejo de errores
const crearActividad = async (actividadData: Omit<Actividad, 'id'>): Promise<Actividad> => {
  try {
    const { data } = await axios.post(`/api/actividad/`, actividadData);
    return data;
  } catch (error) {
    throw new Error('No se pudo crear la actividad');
  }
};

export const useCrearActividad = () => {
  const queryClient = useQueryClient();

  return useMutation<Actividad, Error, Omit<Actividad, 'id'>>({
    mutationFn: crearActividad,
    onSuccess: () => {
      // Invalidar la consulta de actividades para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['Actividad'] });
    },
  });
};