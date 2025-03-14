import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id_herramientas?: number;
    nombre_h: string;
    fecha_prestamo: string;
    estado: string;
}

const crearHerramienta = async (nuevaHerramienta: Omit<Herramientas, 'id_herramientas'>) => {
    try {
        const { data } = await axios.post(`${apiUrl}/herramientas`, nuevaHerramienta);
        return data;
    } catch (error) {
        console.error('Error al crear herramienta:', error);
        throw new Error('No se pudo crear la herramienta');
    }
};

export const useCrearHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: crearHerramienta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herramientas'] });
        },
    });
};
