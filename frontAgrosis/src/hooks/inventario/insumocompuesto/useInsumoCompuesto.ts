import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';  
    factor_conversion: number;
}

export interface Insumo{
    id: number
    nombre: string
    tipo: string
    precio_unidad: number
    cantidad_insumo: number;
    fecha_vencimiento: string
    img: string | null | undefined ;
    fk_unidad_medida: UnidadMedida
    precio_por_base: number; 
}

export interface DetalleInsumoCompuesto {
    id: number;
    cantidad_utilizada: number;
    insumo: Insumo; 
}

export interface InsumoCompuesto {
    id: number;
    nombre: string;
    fk_unidad_medida: UnidadMedida;
    precio_unidad: number;
    detalles: DetalleInsumoCompuesto[];
}

const fetchInsumoCompuesto = async (): Promise<InsumoCompuesto[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}insumocompuesto/`);
        console.log("Respuesta de insumos compuestos", data);
        return data;
    } catch (error) {
        console.error("Error al obtener insumos compuestos:", error);
        throw new Error("No se pudo obtener la lista de insumos compuestos");
    }
};

export const useInsumoCompuesto = () => {
    return useQuery<InsumoCompuesto[], Error>({
        queryKey: ['InsumoCompuesto'],
        queryFn: fetchInsumoCompuesto,
        gcTime: 1000 * 60 * 10, 
    });
};
