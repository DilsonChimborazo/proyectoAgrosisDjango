import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    nombre_h: string;
    fecha_prestamo: string;
    estado: string;
}

const crearHerramienta = async (nuevaHerramienta: Herramientas) => {
    try {
        const { data } = await axios.post(`${apiUrl}/herramientas/`, nuevaHerramienta);
        return data;
    } catch (error: any) {
        console.error('Error al crear herramienta:', error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'No se pudo crear la herramienta');
    }
};

export const useCrearHerramientas = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: crearHerramienta,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['herramientas'] });
        },
        onError: (error) => {
            console.error('Error en la mutación:', error);
        },
    });
};
