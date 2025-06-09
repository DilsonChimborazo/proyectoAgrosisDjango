import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/components/globales/Toast';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: number | null;
  img?: string;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Programacion, Error, FormData>({
    mutationFn: async (nuevaProgramacion: FormData) => {
      console.log('🚀 Datos enviados al backend:', nuevaProgramacion);
      const formDataEntries: Record<string, any> = {};
      for (const [key, value] of nuevaProgramacion.entries()) {
        formDataEntries[key] = value instanceof File ? `File: ${value.name}` : value;
      }
      console.log('🚀 Entradas de FormData:', formDataEntries);

      const response = await axios.post(`${apiUrl}programaciones/`, nuevaProgramacion, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('📩 Respuesta completa del backend:', response);
      return response.data as Programacion;
    },
    onSuccess: (data) => {
      console.log('✅ Programación creada con éxito, datos retornados:', data);
      queryClient.invalidateQueries({ queryKey: ['programaciones'] });
      showToast({
        title: 'Programación Creada',
        description: 'La programación se ha creado correctamente.',
        timeout: 3000,
        variant: 'success',
      });
    },
    onError: (error: any) => {
      let errorMessage = 'Por favor, intenta de nuevo.';
      if (error.response?.data) {
        // Handle Django validation errors (e.g., { "cantidad_insumo": ["This field is required"] })
        if (typeof error.response.data === 'object' && !Array.isArray(error.response.data)) {
          errorMessage = Object.values(error.response.data)
            .flat()
            .join(', ');
        } else {
          errorMessage = error.response.data.detail || error.response.data.message || error.message;
        }
      }
      console.error('❌ Error al crear programación:', {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status,
      });
      showToast({
        title: 'Error al crear programación',
        description: errorMessage,
        timeout: 5000,
        variant: 'error',
      });
    },
  });
};