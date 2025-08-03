import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
}

export interface Eras {
    id: number;
    nombre: string;
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
export interface Especie{
    id:number,
    nombre_comun:string,
    nombre_cientifico:string,
}
export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    fk_id_especie: Especie
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
    const token = localStorage.getItem("token");
    if (!token) {
        console.error("Error: No se ha encontrado un token de autenticación");
        throw new Error("No se ha encontrado un token de autenticación");
    }

    try {
        const { data } = await axios.get<Plantacion[]>(`/api/plantacion/`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return data;
    } catch (error) {
        if (axios.isAxiosError(error)) {
            console.error("Error al obtener las plantaciones:", error.response?.data || error.message);
            throw new Error(error.response?.data?.message || "No se pudo obtener la lista de plantaciones");
        } else {
            console.error("Error al obtener las plantaciones:", error);
            throw new Error("No se pudo obtener la lista de plantaciones");
        }
    }
};

export const usePlantacion = () => {
    return useQuery<Plantacion[], Error>({
        queryKey: ['Plantaciones'],
        queryFn: fetchPlantaciones,
        staleTime: 1000 * 60 * 10,
    });
};
