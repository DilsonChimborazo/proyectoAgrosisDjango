import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { showToast } from '@/components/globales/Toast'; // Asegúrate de importar showToast

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: number | null;
  cantidad_insumo?: number;
  img?: string;
  fk_unidad_medida?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Programacion, Error, FormData>({
    mutationFn: async (nuevaProgramacion: FormData) => {
      // Depuración: Mostrar datos enviados
      console.log('🚀 Datos enviados al backend:', nuevaProgramacion);
      // Para depurar FormData, iteramos y mostramos sus entradas
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

      console.log('📩 Respuesta del backend:', JSON.stringify(response.data, null, 2));
      return response.data as Programacion;
    },
    onSuccess: (data) => {
      console.log('✅ Programación creada con éxito, datos retornados:', data);
      queryClient.invalidateQueries({ queryKey: ['programaciones'] });
      // Mostrar un mensaje de éxito (opcional, ya que se maneja en CrearProgramacionModal)
      showToast({
        title: 'Programación Creada',
        description: 'La programación se ha creado correctamente.',
        timeout: 3000,
        variant: 'success',
      });
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || error.message;
      console.error('❌ Error al crear programación:', {
        message: errorMessage,
        response: error.response?.data,
        status: error.response?.status,
      });
      // El mensaje de error se muestra en CrearProgramacionModal, pero podemos agregar más contexto si es necesario
    },
  });
};
