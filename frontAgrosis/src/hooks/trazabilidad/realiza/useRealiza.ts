// @/hooks/trazabilidad/realiza/useRealiza.ts
import { useQuery, useQueryClient, useMutation } from '@tanstack/react-query';
import axios from 'axios';
import { Cultivo } from '../asignacion/useAsignacion';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
  ciclo_duracion?: string;
}

export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Plantacion {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_cultivo:  Cultivo
  fk_id_especie: Especie;
  cantidad_transplante?: number;
  fk_id_semillero?: Semillero;
  fecha_plantacion: string;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion; // Asegura que sea un objeto Plantacion
  fk_id_actividad: Actividad;  // Asegura que sea un objeto Actividad
}

const fetchRealiza = async (): Promise<Realiza[]> => {
  try {
    const { data } = await axios.get(`${apiUrl}realiza/`);
    return data;
  } catch (error: any) {
    console.error("Error al obtener realiza:", error.response?.data || error.message);
    throw new Error("No se pudo obtener la lista de realiza");
  }
};

export const useRealiza = () => {
  return useQuery<Realiza[], Error>({
    queryKey: ['Realiza'],
    queryFn: fetchRealiza,
    gcTime: 1000 * 60 * 10, // 10 minutos
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};

export interface CrearRealizaDTO {
  fk_id_plantacion: Plantacion;
  fk_id_actividad: Actividad;
}

const crearRealiza = async (realizaData: CrearRealizaDTO): Promise<Realiza> => {
  try {
    const response = await axios.post(`${apiUrl}realiza/`, realizaData);
    console.log("Realiza creado exitosamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al crear realiza:", error.response?.data || error.message);
    throw new Error("No se pudo crear el realiza");
  }
};

export const useCrearRealiza = () => {
  const queryClient = useQueryClient();

  return useMutation<Realiza, Error, CrearRealizaDTO>({
    mutationFn: crearRealiza,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Realiza'] });
    },
  });
};