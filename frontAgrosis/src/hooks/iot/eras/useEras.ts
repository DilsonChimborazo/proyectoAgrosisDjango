import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL

export interface Ubicacion {
    id: number;
    latitud: number;
    longitud: number;
}

export interface Lotes {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: string;
}

export interface Eras {
    id: number;
    nombre: string;
    fk_id_lote: { id: number; nombre_lote: string } | null;
    descripcion: string;
    estado: boolean;
}

const fetchEras = async (): Promise<Eras[]> => {
    try {
        const token = localStorage.getItem('token');
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const { data } = await axios.get(`${apiUrl}eras/`, { headers });
        return data;
    } catch (error) {
        console.error('Error al obtener las eras:', error);
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            throw new Error('Sesión no autorizada. Por favor, inicia sesión.');
        }
        throw new Error('No se pudo obtener la lista de las eras');
    }
};

export const useEras = () => {
    return useQuery<Eras[], Error>({
        queryKey: ['eras'],
        queryFn: fetchEras,
        staleTime: 1000 * 60 * 10,
    });
};