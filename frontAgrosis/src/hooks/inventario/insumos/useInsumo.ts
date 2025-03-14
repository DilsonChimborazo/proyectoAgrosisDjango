import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo{
    id_insumo: number;
    nombre_h: Text;
    tipo: Text;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: Text;

}
// Función para obtener los usuarios con manejo de errores
const fetch = async (): Promise<Insumo[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}insumo/`);
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