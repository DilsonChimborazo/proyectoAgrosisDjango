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
    cantidad_insumo: number | 0 ;
    cantidad_en_base: string | null;
    fecha_vencimiento: string
    img: string | null | undefined ;
    fk_unidad_medida: UnidadMedida
    es_compuesto: boolean;
    precio_por_base: number;
    tipoEnglis: string
}

const fetch = async (): Promise<Insumo[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}insumo/`);
        console.log("respuesta de insumos", data)
        return data;
    } catch (error) {
        console.error("Error al obtener el insumo:", error);
        throw new Error("No se pudo obtener la lista de insumo");
    }
};


export const useInsumo = () => {
    return useQuery<Insumo[], Error>({
        queryKey: ['Insumo'],
        queryFn: fetch,
        gcTime: 1000 * 60 * 10, 

    });
};