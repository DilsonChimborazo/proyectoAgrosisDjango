import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces necesarias para Venta
export interface TipoCultivo {
  id_tipo_cultivo: number;
  nombre: string;
  descripcion: string;
}

export interface Especie {
  id_especie: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: number;
}

export interface Semillero {
  id_semillero: number;
  nombre_semilla: string;
  fecha_siembra: string;
  fecha_estimada: string;
  cantidad: number;
}

export interface Cultivo {
  id: number;
  fecha_plantacion: string;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: number;
  fk_id_semillero: number;
}


export interface Produccion {
  id_produccion: number;
  fk_id: Cultivo 
  cantidad_produccion: number;
  fecha: string;
}

export interface Venta {
  id_venta: number;
  fk_id_produccion: Produccion | null; 
  cantidad: number;
  precio_unidad: number;
  fecha: string;
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