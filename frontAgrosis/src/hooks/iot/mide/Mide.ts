import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Mide {
  id: number;
  valor_medicion: number;
  fecha_medicion: string;
  fk_id_sensor: Sensor | null;
  fk_id_era: Eras | null;
}

export interface Sensor {
    id: number;
    nombre_sensor: string;
    tipo_sensor: string;
    unidad_medida: string;
    descripcion: string;
    medida_minima: number;
    medida_maxima: number;
  }
  
  export interface Ubicacion {
    id: number;
    latitud: number;
    longitud: number;
  }
  
  export interface Lotes {
    id: number;
    fk_id_ubicacion: Ubicacion;
    dimencion: string;
    nombre_lote: string;
    estado: string;
  }
  
  export interface Eras {
    id: number;
    fk_id_lote: { nombre_lote: string } | null;
    descripcion: string;
  }

const Mide = async (): Promise<Mide[]> => {
    try {
        const { data } = await axios.get(`${apiUrl}mide/`);
        return data;
    } catch (error) {
        console.error("Error al obtener usuarios:", error);
        throw new Error("No se pudo obtener la lista de usuarios");
    }
};

export const useMide = () => {
    return useQuery<Mide[], Error>({
        queryKey: ['mide'],
        queryFn: Mide,
        staleTime: 1000 * 60 * 10,
    });
};
