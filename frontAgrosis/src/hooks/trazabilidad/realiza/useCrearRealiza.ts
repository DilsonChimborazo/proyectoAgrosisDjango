import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface CrearRealizaDTO {
  fk_id_cultivo: number;
  fk_id_actividad: number;
}

export const useCrearRealiza = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CrearRealizaDTO) => {
      console.log('Enviando datos al backend:', data); // Depuración
      const response = await axios.post('http://127.0.0.1:8000/api/realiza/', data);
      return response.data;
    },
    onSuccess: () => {
      console.log('Realiza creado exitosamente');
      queryClient.invalidateQueries({ queryKey: ['realiza'] });
    },
    onError: (error: any) => {
      console.error('Error al crear realiza:', error.message);
    },
  });
};