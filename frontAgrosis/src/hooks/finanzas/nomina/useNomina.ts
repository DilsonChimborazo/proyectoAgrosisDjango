import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;


export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    duracion: number;
    descripcion: string;
    tipo_control: string;
    fk_id_plantacion: Plantacion | null;
    fk_id_pea: Pea | null;
    fk_id_insumo: Insumo | null;
    cantidad_insumo: number;
    fk_identificacion: Usuario | null;
    img: string | null;
}

export interface Pea {
    id: number;
    nombre_pea: string;
    descripcion: string;
    tipo_pea: string;
}
export interface Plantacion {
    id: number;
    fk_id_eras: Eras | null;
    fk_id_cultivo: Cultivo | null;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: Semillero | null;
}
export interface Eras {
    id: number;
    descripcion: string;
    fk_id_lote: Lote | null;
    estado: boolean;
}

export interface Lote {
    id: number;
    dimencion: string;
    nombre_lote: string;
    estado: boolean;
    
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
    nombre_cultivo: string;
    fecha_plantacion: string;
    descripcion: string;
}

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    stock: number;
    fk_unidad_medida: string;
}

export interface Usuario {
    id: number;
    identificacion: string;
    email: string;
    nombre: string;
    apellido: string;
    is_active: boolean;
    fk_id_rol: { id: number; rol: string } | null;
    ficha: { id: number; numero_ficha: number; nombre_ficha: string } | null;
}

export interface Salario {
    id: number;
    precio_jornal: number;
    horas_por_jornal: number;
    fecha_inicio: string;
    fecha_fin : string;
    activo : boolean;
    
}

export interface UnidadMedida {
  id: number;
  nombre_medida: string;
  unidad_base: 'g' | 'ml' | 'u';
  factor_conversion: number;
}

interface Programacion {
  id?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_realizada: string; // Formato esperado: YYYY-MM-DD
  duracion: number; // Duración en minutos
  fk_id_asignacionActividades: Asignacion;
  cantidad_insumo: number;
  img?: File | string;
  fk_unidad_medida: UnidadMedida;
}


export interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: Realiza;
  fk_identificacion: Usuario;
}

export interface Realiza {
  id: number;
  fk_id_cultivo: Cultivo;
  fk_id_actividad: Actividad;
}

export interface Cultivo {
  id: number;
  nombre_cultivo: string;
  descripcion: string;
  fk_id_especie: Especie;
}

export interface Especie {
  id: number;
  nombre_cientifico: string;
  nombre_comun: string;
  descripcion: string;
  fk_id_tipo_cultivo: TipoCultivo;
}

export interface TipoCultivo {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface Actividad {
  id: number;
  nombre_actividad: string;
  descripcion: string;
}

export interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
}

export interface Nomina {
    id : number;
    fk_id_programacion : Programacion;
    fk_id_salario : Salario;
    pago_total : number;
    fk_id_control_fitosanitario : ControlFitosanitario;

}

// Función para obtener la lista de producción
const fetchNomina = async (): Promise<Nomina[]> => {
  try {
    const { data } = await axios.get<Nomina[]>(`${apiUrl}nomina/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de producción:", error);
    throw new Error("No se pudo obtener la lista de producción");
  }
};

// Hook para usar en los componentes
export const useNomina = () => {
  return useQuery<Nomina[], Error>({
    queryKey: ['nomina'],
    queryFn: fetchNomina,
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  });
};