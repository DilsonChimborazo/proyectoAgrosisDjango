import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Plantacion {
    id: number;
    fk_id_eras: Eras;
    fk_id_cultivo: Cultivo;
    cantidad_transplante: number;
    fk_id_semillero: Semillero;
    fecha_plantacion: String;
}

export interface Eras {
    id: number;
    nombre:string;
    descripcion: string;
    fk_id_lote: Lote;
    estado: boolean;
}

export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    fk_id_especie: Especie;
}

export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo;
}

export interface TipoCultivo {
    id: number;
    ciclo_duracion: string;
    nombre: string;
    descripcion: string;
}

export interface Semillero {
    id: number;
    nombre_semilla: string;
    fecha_siembra: Date;
    fecha_estimada: Date;
    cantidad: number;
}

// Función para obtener las plantaciones con manejo de errores
const fetchPlantaciones = async (): Promise<Plantacion[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}plantacion/`);
        return data.map((plantacion: any) => ({
            ...plantacion,
            fecha_plantacion: new Date(plantacion.fecha_plantacion).toLocaleDateString()
        }));
    } catch (error) {
        console.error("Error al obtener plantaciones:", error);
        throw new Error("No se pudo obtener la lista de plantaciones");
    }
};

export const usePlantaciones = () => {
    return useQuery<Plantacion[], Error>({
        queryKey: ['Plantaciones'],
        queryFn: fetchPlantaciones,
        gcTime: 1000 * 60 * 10, // 10 minutos de caché
    });
};