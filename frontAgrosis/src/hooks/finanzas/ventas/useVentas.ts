import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Produccion {
  id_produccion: number;
  cantidad_produccion: number;
  fecha: string;
}

export interface Venta {
  id_venta: number;
  precio_unidad: number;
  cantidad: number;
  fecha: string;
  fk_id_produccion: Produccion;
}


const fetchVenta = async (): Promise<Venta[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}venta/`);
        return data;
    } catch (error) {
        console.error("Error al obtener la venta:", error);
        throw new Error("No se pudo obtener la lista de la venta");
    }
};

export const useVenta = () => {
    return useQuery<Venta[], Error>({
        queryKey: ['venta'],
        queryFn: fetchVenta,
        staleTime: 1000 * 60 * 10,
    });
};
