import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
    ciclo_duracion: string;
}

const fetchTiposCultivo = async (): Promise<TipoCultivo[]> => {
    const response = await axios.get(`${apiUrl}tipos_cultivo/`);
    return response.data;
};

export const useTipoCultivo = () => {
    return useQuery<TipoCultivo[], Error>({
        queryKey: ['tiposCultivo'],
        queryFn: fetchTiposCultivo,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};
