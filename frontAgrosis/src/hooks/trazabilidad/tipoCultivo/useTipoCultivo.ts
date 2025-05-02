import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
}

const fetchTiposCultivo = async (): Promise<TipoCultivo[]> => {
    const response = await axios.get('http://localhost:8000/api/tipos_cultivo/');
    return response.data;
};

export const useTipoCultivo = () => {
    return useQuery<TipoCultivo[], Error>({
        queryKey: ['tiposCultivo'],
        queryFn: fetchTiposCultivo,
        staleTime: 5 * 60 * 1000, // 5 minutos
    });
};