import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { InsumoCompuesto } from './useInsumoCompuesto'; // Asegúrate de que esté exportado correctamente

const apiUrl = import.meta.env.VITE_API_URL;



interface CreateInsumoCompuestoData {
  nombre: string;
  fk_unidad_medida: number
;
  detalles: {
    insumo: number;
    cantidad_utilizada: number;
  }[];
  
}

const createInsumoCompuesto = async (
    insumoCompuestoInput: CreateInsumoCompuestoData
): Promise<InsumoCompuesto> => {
const token = localStorage.getItem('token');
    if (!token) {
        throw new Error("No se encontró el token.");
    }

   const { data } = await axios.post(
     `${apiUrl}insumocompuesto/`,
     insumoCompuestoInput,
     {
       headers: {
         Authorization: `Bearer ${token}`,
         'Content-Type': 'application/json',
       },
     }
   );
   return data;
 };

 export const useCreateInsumoCompuesto = () => {
   const queryClient = useQueryClient();
   return useMutation({
     mutationFn: createInsumoCompuesto,
     onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: ['InsumoCompuesto'] });
     },
     onError: (error) => {
       console.error('Error al crear insumo compuesto:', error.message);
       alert('Hubo un error al registrar el insumo compuesto. Intenta de nuevo.');
     },
   });
 };
