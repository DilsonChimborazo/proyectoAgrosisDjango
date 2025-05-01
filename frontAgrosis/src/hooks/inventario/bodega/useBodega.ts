import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id: number
    nombre_h: string
    cantidad_herramienta: number
    estado: 'Disponible' | 'Prestado' | 'En reparacion'
}

export interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';
    factor_conversion: number;
}

export interface Insumos {
    id: number
    nombre: string
    tipo: string
    precio_unidad: number
    precio_por_base: number
    cantidad_insumo: number
    fecha_vencimiento: string
    img: string 
    fk_unidad_medida: UnidadMedida
}

export interface Asignacion {
    id: number
    estado: string
    fecha_programada: string
    observaciones: string
    fk_id_realiza: number | null
    fk_identificacion: number | null
}

export interface Bodega {
    id: number;
    onSuccess: () => void;
    fk_id_herramientas: Herramientas | null;
    fk_id_insumo: Insumos | null;
    fk_id_asignacion: Asignacion | null;
    cantidad_herramienta: number;
    cantidad_insumo: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
    fk_unidad_medida: UnidadMedida | null;
    cantidad_en_base: number | null;
    costo_insumo: number | null;
}

const fetchBodega = async (): Promise<Bodega[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}bodega/`);
        return data;
    } catch (error) {
        console.error("Error al obtener los movimientos de bodega:", error);
        throw new Error("No se pudo obtener la lista de bodega");
    }
};

export const useBodega = () => {
    return useQuery<Bodega[], Error>({
        queryKey: ['Bodega'],
        queryFn: fetchBodega,
        gcTime: 1000 * 60 * 10, 
    });
};