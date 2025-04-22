import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface Especie {
    id: number;
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number;
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
    fecha_plantacion: string;
    nombre_cultivo: string;
    descripcion: string;
    fk_id_especie: Especie | null;
    fk_id_semillero: Semillero | null;
  }

export interface Produccion {
    id_produccion: number;
    nombre_produccion: string;
    fk_id_cultivo: Cultivo | null;
    cantidad_producida: number;
    fecha: string;
    stock_disponible: number;
  }
  
  export interface Venta {
    id_venta: number;
    fk_id_produccion: Produccion | null;
    cantidad: number;
    precio_unidad: number;
    fecha: string;
  }
  
  export interface Stock {
    id: number;
    fk_id_produccion: Produccion | null;
    fk_id_venta: Venta | null;
    cantidad: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
  }
  
  
  // Función para obtener los datos de Stock
  const fetchStock = async (): Promise<Stock[]> => {
    try {
      const { data } = await axios.get(`${apiUrl}stock/`);
      return data;
    } catch (error) {
      console.error("Error al obtener los datos de stock:", error);
      throw new Error("No se pudo obtener la lista de stock");
    }
  };
  
  // Hook para manejar las operaciones con Stock
  export const useStock = () => {
    return useQuery<Stock[], Error>({
      queryKey: ['stock'],
      queryFn: fetchStock,
      staleTime: 1000 * 60 * 10,  // 10 minutos
    });
  };
  