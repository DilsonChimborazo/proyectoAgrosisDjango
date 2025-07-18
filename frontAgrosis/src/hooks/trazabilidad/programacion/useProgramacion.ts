// src/hooks/trazabilidad/programacion/useProgramacion.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;
export interface Rol{
  id: number;
  rol: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  fk_id_rol: Rol
}

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
export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
}
export interface Especie {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface Plantacion {
  id: number;
  descripcion: string;
  fk_id_cultivo: Cultivo;
  cantidad_transplante?: number;
  fk_id_semillero?: Semillero | undefined;
  fecha_plantacion: string;
}

export interface Semillero {
  id: number;
  nombre_semilla: string;
  fecha_siembra: Date;
  fecha_estimada: Date;
  cantidad: number;
}

export interface Lote {
  id: number;
  nombre_lote: string;
  dimencion: string;
  estado: boolean;
}

export interface Eras {
  id: number;
  descripcion: string;
  fk_id_lote: Lote;
  estado: boolean;
}

export interface Realiza {
  id: number;
  fk_id_plantacion: Plantacion | undefined;
  fk_id_actividad: Actividad | undefined;
}
export interface Insumo {
  id: number;
  nombre: string; // Puedes agregar más propiedades si la API las incluye
}

export interface Herramienta {
  id: number;
  nombre_h: string; // Puedes agregar más propiedades si la API las incluye
}

export interface RecursosAsignados {
  insumos?: Insumo[];
  herramientas?: Herramienta[];
}
export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza | number;
  fk_identificacion: Usuario[];
  recursos_asignados: (string | RecursosAsignados)[];
}

export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

export interface Programacion {
  id: number;
  fk_id_asignacionActividades: Asignacion;
  fecha_realizada: string;
  duracion: number;
  cantidad_insumo: number;
  img: string | null |File; // Aseguramos que img es una URL
  fk_unidad_medida: UnidadMedida;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

const fetchProgramaciones = async (): Promise<Programacion[]> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}programaciones/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data; // Devolvemos los datos tal cual, con img como URL desde el backend
};

export const useProgramacion = () => {
  return useQuery<Programacion[], Error>({
    queryKey: ['programaciones'],
    queryFn: fetchProgramaciones,
  });
};