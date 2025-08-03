import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


export interface TipoResiduo {
  nombre: string;
  descripcion: string;
}

const crearTipoResiduo = async (tipo: TipoResiduo) => {
  const { data } = await axios.post(`/api/tipo_residuos/`, tipo, {
    headers: {
      "Content-Type": "application/json",
    },
  });

  return data;
};

export const useCrearTipoResiduos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: crearTipoResiduo,
    onSuccess: () => {
      // Invalidar la caché de tipos de residuos para forzar una actualización
      queryClient.invalidateQueries({ queryKey: ['tipo_residuos'] });
    },
    onError: (error) => {
      console.error("Error al crear el tipo de residuo:", error);
    },
  });
};