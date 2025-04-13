
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id: number
    nombre_h: string
    cantidad: number
    estado: 'Disponible' | 'Prestado' | 'En reparacion'
}
export interface UnidadMedida{
    id:number
    nombre_medida:string
    abreviatura: string
}

export interface Insumos{
    id: number
    nombre: string
    tipo: string
    precio_unidad: number
    cantidad: number
    fecha_vencimiento: string
    img: string 
    fk_unidad_medida: UnidadMedida
}

export interface Asignacion{
    estado: string
    fecha_programada: string
    observaciones: string
    fk_id_realiza: number | null
    fk_identificacion:number | null
}

export interface Bodega {
    id: number;
    fk_id_herramientas: Herramientas | null;
    fk_id_insumo: Insumos | null;
    fk_id_asignacion: Asignacion | null;
    cantidad: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
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
