import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


export interface Cultivos{
    id: number;
    nombre_cultivo: string; 
    descripcion: string;
    fk_id_especie: Especie;
    
}

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
}

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo ;
}

export interface Cultivos {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    fk_id_especie: Especie;
}

const fetchAsignacion = async (): Promise<Cultivos[]> => {
    try {
        const response = await axios.get(`${apiUrl}cultivo/`);
        return response.data;
    } catch (error: any) {
        console.error("Error al obtener cultivos:", error.response?.data || error.message);
        throw new Error("No se pudo obtener la lista de los cultivos");
    }
};

export const useCultivo = () => {
    return useQuery<Cultivos[], Error>({
        queryKey: ['Cultivos'],
        queryFn: fetchAsignacion,
        gcTime: 1000 * 60 * 10,
        staleTime: 1000 * 60 * 5,
    });
};