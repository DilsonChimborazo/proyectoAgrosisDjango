import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    duracion: number;
    descripcion: string;
    tipo_control: string;
    fk_id_plantacion: Plantacion | null;
    fk_id_pea: Pea | null;
    fk_id_insumo: Insumo | null;
    cantidad_insumo: number;
    fk_identificacion: Usuario | null;
    img: string | null;
}

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
    tipo_pea: string;
}
export interface Plantacion {
    id: number;
    fk_id_eras: Eras | null;
    fk_id_cultivo: Cultivo | null;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: Semillero | null;
}
export interface Eras {
    id: number;
    descripcion: string;
    fk_id_lote: Lote | null;
    estado: boolean;
}

export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
    
}

export interface Semillero {
    id: number;
    nombre_semilla: string;
    fecha_siembra: string; 
    fecha_estimada: string;
    cantidad: number;
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
    fk_unidad_medida: string;
}

export interface Usuario {
    id: number;
    identificacion: string;
    email: string;
    nombre: string;
    apellido: string;
    is_active: boolean;
    fk_id_rol: { id: number; rol: string } | null;
    ficha: { id: number; numero_ficha: number; nombre_ficha: string } | null;
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
        queryKey: ['controlFitosanitario'],
        queryFn: fetchControlFitosanitario,
        gcTime: 1000 * 60 * 10,
    });
};