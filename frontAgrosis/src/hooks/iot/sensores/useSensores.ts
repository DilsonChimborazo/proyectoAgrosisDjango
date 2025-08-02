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
    const token = localStorage.getItem("token"); 
    if (!token) {
        throw new Error("No se encontró el token en localStorage");
    }

    const { data } = await axios.get(`${apiUrl}sensores/`, {
        headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
        }
    });

    return data;
    } catch (error) {
    console.error("Error al obtener sensores:", error);
    throw new Error("No se pudo obtener la lista de sensores");
    }
};

export const useSensores = () => {
    return useQuery<Sensores[], Error>({
        queryKey: ['sensores'],
        queryFn: fetchSensores,
        staleTime: 1000 * 60 * 10,
    });
};
