import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface Lotes {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
}

const fetchLotes = async (): Promise<Lotes[]> => {
    try {
        const { data } = await axios.get(`/api/lote/`);
        return data;
    } catch (error) {
        console.error("Error al obtener los lotes:", error);
        throw new Error("No se pudo obtener la lista de lotes");
    }
};

export const useLotes = () => {
    return useQuery<Lotes[], Error>({
        queryKey: ['lotes'],
        queryFn: fetchLotes,
        staleTime: 1000 * 60 * 10,
    });
};
