import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    descripcion: string;
    fk_id_desarrollan: Desarrollan;
}

export interface Desarrollan {
    id: number;
    fk_id_cultivo: Cultivo | null;
    fk_id_pea: Pea | null;
}

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
}

const fetchControlFitosanitario = async (): Promise<ControlFitosanitario[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}control_fitosanitario/`);
        return data;
    } catch (error) {
        console.error("Error al obtener Control Fitosanitario:", error);
        throw new Error("No se pudo obtener la lista de los Controles Fitosanitarios");
    }
};

export const useControlFitosanitario = () => {
    return useQuery<ControlFitosanitario[], Error>({
        queryKey: ['ControlFitosanitario'],
        queryFn: fetchControlFitosanitario,
        gcTime: 1000 * 60 * 10, 
    });
};
