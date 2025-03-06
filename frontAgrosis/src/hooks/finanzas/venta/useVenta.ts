import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces necesarias para Venta
export interface Produccion {
  id_produccion: number;
  cantidad_produccion: number;
  fecha: string;
}

export interface Venta {
  id_venta: number;
  fk_id_produccion: Produccion | null; 
  cantidad: number;
  precio_unitario: number;
  total_venta: number;
  fecha_venta: string;
}

const fetchVentas = async (): Promise<Venta[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}venta/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de venta:", error);
    throw new Error("No se pudo obtener la lista de ventas");
  }
};

export const useVenta = () => {
  return useQuery<Venta[], Error>({
    queryKey: ['ventas'],
    queryFn: fetchVentas,
    staleTime: 1000 * 60 * 10,
  });
};