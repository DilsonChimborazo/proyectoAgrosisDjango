import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

export interface CrearRealizaDTO {
  fk_id_plantacion: number;
  fk_id_actividad: number;
}

export const useCrearRealiza = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CrearRealizaDTO) => {
      const response = await axios.post('http://127.0.0.1:8000/api/realiza/', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realiza'] });
    },
  });
};