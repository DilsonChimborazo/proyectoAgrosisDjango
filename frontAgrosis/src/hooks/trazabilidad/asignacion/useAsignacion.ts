import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Asignacion{
    id: number;
    fecha: Date;
    observaciones: string;
    fk_id_actividad: Actividad;
    id_identificacion: Usuario;
}

interface Actividad {
    id: number;
    nombre_actividad: string;
}

export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
}

// Función para obtener los usuarios con manejo de errores
const fetchAsignacion = async (): Promise<Asignacion[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}asignaciones_actividades/`);
        return data;
    } catch (error) {
        console.error("Error al obtener asignaciones de actividades:", error);
        throw new Error("No se pudo obtener la lista de las actividades asignadas");
    }
};


export const useAsignacion = () => {
    return useQuery<Asignacion[], Error>({
        queryKey: ['Asignacion'],
        queryFn: fetchAsignacion,
        gcTime: 1000 * 60 * 10, 

    });
};


