import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { InsumoCompuesto } from './useInsumoCompuesto'; 

const apiUrl = import.meta.env.VITE_API_URL;

interface CreateInsumoCompuestoData {
    nombre: string;
    fk_unidad_medida: number;
    detalles: {
        insumo: number;
        cantidad_utilizada: number;
    }[];
}

const createInsumoCompuesto = async (nuevoInsumo: CreateInsumoCompuestoData): Promise<InsumoCompuesto> => {
    const token = localStorage.getItem('token'); // <- Aquí tomas el token

    const { data } = await axios.post(
        `${apiUrl}insumocompuesto/`,
        nuevoInsumo,
        {
            headers: {
                Authorization: `Bearer ${token}`, // <- Aquí envías el token
                'Content-Type': 'application/json', // <- Opcional pero recomendable
            },
        }
    );
    return data;
};

export const useCreateInsumoCompuesto = () => {
    const queryClient = useQueryClient();
    return useMutation<InsumoCompuesto, Error, CreateInsumoCompuestoData>({
        mutationFn: createInsumoCompuesto,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['InsumoCompuesto'] });
        },
    });
};
