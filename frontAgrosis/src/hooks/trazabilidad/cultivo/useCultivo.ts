import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Cultivos{
    id: number;
    nombre_cultivo: string; 
    fecha_plantacion: Date;
    descripcion: string;
    fk_id_especie: Especie;
    fk_id_semillero: Semillero;
}

export interface Semillero {
    id: number;
    nombre_semillero: string;
    fecha_siembra: Date;
    fecha_estimada: Date;
    cantidad: number;
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
    fk_id_tipo_cultivo: TipoCultivo;
}

// Función para obtener los usuarios con manejo de errores
const fetchAsignacion = async (): Promise<Cultivos[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}cultivo/`);
        return data;
    } catch (error) {
        console.error("Error al obtener cultivos:", error);
        throw new Error("No se pudo obtener la lista de los cultivos");
    }
};


export const useCultivo = () => {
    return useQuery<Cultivos[], Error>({
        queryKey: ['Cultivos'],
        queryFn: fetchAsignacion,
        gcTime: 1000 * 60 * 10, 

    });
};


