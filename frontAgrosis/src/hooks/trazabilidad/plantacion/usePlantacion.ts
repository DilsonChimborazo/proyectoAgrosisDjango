import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
    
}

export interface Eras {
    id: number;
    nombre:string,
    descripcion: string;
    fk_id_lote: Lote | null;
    estado: boolean;
}

export interface Semillero {
    id: number;
    nombre_semilla: string;
    fecha_siembra: string; 
    fecha_estimada: string;
    cantidad: number;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    
}

export interface Plantacion {
    id: number;
    fk_id_eras: Eras | null;
    fk_id_cultivo: Cultivo;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: Semillero | null;
}

const fetchPlantaciones = async (): Promise<Plantacion[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}plantacion/`);
        return data;
    } catch (error) {
        console.error("Error al obtener plantaciones:", error);
        throw new Error("No se pudo obtener la lista de plantaciones");
    }
};

export const usePlantacion = () => {
    return useQuery<Plantacion[], Error>({
        queryKey: ['Plantaciones'],
        queryFn: fetchPlantaciones,
        gcTime: 1000 * 60 * 10, 
    });
};