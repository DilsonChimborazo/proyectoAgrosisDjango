import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

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

      const response = await axios.post(`${apiUrl}realiza/`, data, {
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
