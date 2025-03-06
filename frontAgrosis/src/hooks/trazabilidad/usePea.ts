import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
}

// Función para obtener la lista de Peas con manejo de errores
const fetchPeas = async (): Promise<Pea[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}pea/`);
        return data;
    } catch (error) {
        console.error("Error al obtener la lista de Peas:", error);
        throw new Error("No se pudo obtener la lista de Peas");
    }
};

// Hook personalizado para manejar la consulta de Peas
export const usePea = () => {
    return useQuery<Pea[], Error>({
        queryKey: ['Pea'],
        queryFn: fetchPeas,
        gcTime: 1000 * 60 * 10, 
    });
};
