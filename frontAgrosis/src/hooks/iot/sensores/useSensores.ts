import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Sensores {
    id: number;
    nombre_sensor: string;
    tipo_sensor: string;
    unidad_medida: string;
    descripcion: string;
    medida_minima: number;
    medida_maxima: number;
}

const fetchSensores = async (): Promise<Sensores[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}sensores/`);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw new Error("No se pudo obtener la lista de usuarios");
    }
};

export const useSensores = () => {
    return useQuery<Sensores[], Error>({
        queryKey: ['sensores'],
        queryFn: fetchSensores,
        staleTime: 1000 * 60 * 10,
    });
};
