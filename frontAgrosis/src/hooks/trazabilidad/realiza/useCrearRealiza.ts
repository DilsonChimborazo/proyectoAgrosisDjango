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
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No hay token de autenticación");
      }

      const response = await axios.post(`/api/realiza/`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['realiza'] });
    },
  });
};
