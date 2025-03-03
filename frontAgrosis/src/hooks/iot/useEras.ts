import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Ubicacion{
    id: number;
    latitud: number;
    longitud: number;
}

export interface Lotes {
    id: number;
    fk_id_ubicacion: Ubicacion;
    dimencion: string;
    nombre_lote: string;
    estado: string;
}

export interface Eras{
    id: number;
    fk_id_lote: { nombre_lote: string } | null | undefined; 
    descripcion: number;
}

const fetchEras = async (): Promise<Eras[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}eras/`);
        return data;
    } catch (error) {
        console.error("Error al obtener las eras:", error);
        throw new Error("No se pudo obtener la lista de las eras");
    }
};

export const useEras = () => {
    return useQuery<Eras[], Error>({
        queryKey: ['eras'],
        queryFn: fetchEras,
        staleTime: 1000 * 60 * 10,
    });
};
