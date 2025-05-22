import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface TrazabilidadCultivoReporte {
  plantacion_id: number;
  cultivo: string;
  especie?: string;
  fecha_plantacion: string;
  era?: string;
  lote?: string;
  total_tiempo_minutos: number;
  total_horas: number;
  jornales: number;
  costo_mano_obra: number;
  egresos_insumos: number;
  ingresos_ventas: number;
  beneficio_costo: number;
  detalle_actividades: DetalleActividad[];
  detalle_insumos: DetalleInsumo[];
  detalle_ventas: DetalleVenta[];
  resumen: Resumen;
}

export interface DetalleActividad {
  id: number;
  estado: string;
  fecha_programada: string;
  fecha_realizada?: string;
  actividad: string;
  responsable?: string;
  duracion_minutos: number;
  observaciones: string;
  tipo_control?: string;
  pea?: string;
}

export interface DetalleInsumo {
  tipo: 'Actividad' | 'Control Fitosanitario';
  nombre: string;
  tipo_insumo: string;
  cantidad: number;
  unidad_medida?: string;
  cantidad_base?: number;
  precio_por_base?: number;
  costo_total: number;
  fecha: string;
  actividad_asociada?: string;
  pea?: string;
}

export interface DetalleVenta {
  cantidad: number;
  precio_unidad: number;
  ingreso_total: number;
  fecha: string;
  unidad_medida?: string;
  produccion_asociada?: string;
}

export interface Resumen {
  total_actividades: number;
  total_controles: number;
  total_ventas: number;
  total_insumos: number;
  costo_total: number;
  balance: number;
}

export interface SnapshotTrazabilidad {
  id: number;
  fecha_registro: string;
  version: number;
  trigger?: string;
  datos: TrazabilidadCultivoReporte;
}

export interface ResumenTrazabilidad {
  ultima_actualizacion: string;
  datos_actuales: TrazabilidadCultivoReporte;
}

// Función auxiliar para formatear fechas
const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return 'Sin fecha';
  const date = new Date(dateStr);
  return isNaN(date.getTime())
    ? 'Sin fecha'
    : date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

const transformarDatosTrazabilidad = (data: any): TrazabilidadCultivoReporte => ({
  ...data,
  fecha_plantacion: formatDate(data.fecha_plantacion),
  detalle_actividades: data.detalle_actividades?.map((act: any) => ({
    ...act,
    fecha_programada: formatDate(act.fecha_programada),
    fecha_realizada: formatDate(act.fecha_realizada),
  })) || [],
  detalle_insumos: data.detalle_insumos?.map((ins: any) => ({
    ...ins,
    fecha: formatDate(ins.fecha),
  })) || [],
  detalle_ventas: data.detalle_ventas?.map((ven: any) => ({
    ...ven,
    fecha: formatDate(ven.fecha),
  })) || []
});

const fetchTrazabilidadActual = async (plantacionId: number) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}trazabilidad/plantacion/${plantacionId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return transformarDatosTrazabilidad(data);
};

const fetchResumenActual = async (plantacionId: number) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}resumen-actual/${plantacionId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return transformarDatosTrazabilidad(data.datos_actuales);
};

const fetchHistorialTrazabilidad = async (plantacionId: number) => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}trazabilidad/historico/${plantacionId}/`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return data.results.map((snapshot: any) => ({
    ...snapshot,
    datos: transformarDatosTrazabilidad(snapshot.datos)
  }));
};

export const useTrazabilidadActual = (plantacionId: number) => {
  return useQuery({
    queryKey: ["trazabilidadActual", plantacionId],
    queryFn: () => fetchTrazabilidadActual(plantacionId),
    enabled: !!plantacionId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useResumenActual = (plantacionId: number) => {
  return useQuery({
    queryKey: ["resumenActual", plantacionId],
    queryFn: () => fetchResumenActual(plantacionId),
    enabled: !!plantacionId
  });
};

export const useHistorialTrazabilidad = (plantacionId: number) => {
  return useQuery<SnapshotTrazabilidad[], Error>({
    queryKey: ["historialTrazabilidad", plantacionId],
    queryFn: () => fetchHistorialTrazabilidad(plantacionId),
    enabled: !!plantacionId
  });
};
