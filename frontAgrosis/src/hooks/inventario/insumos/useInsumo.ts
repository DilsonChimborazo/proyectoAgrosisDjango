import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo{
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: string;

}
const fetch = async (): Promise<Insumo[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}insumo/`);
        return data;
    } catch (error) {
        console.error("Error al obtener el insumo:", error);
        throw new Error("No se pudo obtener la lista de insumo");
    }
};


export const useInsumo = () => {
    return useQuery<Insumo[], Error>({
        queryKey: ['Insumo'],
        queryFn: fetch,
        gcTime: 1000 * 60 * 10, 

    });
};