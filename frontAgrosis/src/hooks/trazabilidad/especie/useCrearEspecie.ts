import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
  id: number,
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: string;
}

export const useCrearEspecie = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (nuevaEspecie: Especie) => {
      console.log("🚀 Datos enviados al backend para crear especie:", nuevaEspecie);
      const { data } = await axios.post(`${apiUrl}especies/`, nuevaEspecie); // Endpoint para crear especie
      return data;
    },
    onSuccess: () => {
      console.log("✅ Especie creada con éxito");
      queryClient.invalidateQueries({ queryKey: ['Especies'] }); // Refrescar la lista de especies
    },
    onError: (error) => {
      console.error("❌ Error al crear especie:", error);
    },
  });
};

