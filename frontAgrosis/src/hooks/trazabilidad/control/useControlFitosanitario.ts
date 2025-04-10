import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    descripcion: string;
    tipo_control: string;
    fk_id_cultivo: Cultivo;
    fk_id_pea: Pea;
    fk_id_insumo: Insumo;
    cantidad_insumo: number;
}

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
    tipo_pea: string;
}

export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
}

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    stock: number;
    unidad_medida: string;  
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
