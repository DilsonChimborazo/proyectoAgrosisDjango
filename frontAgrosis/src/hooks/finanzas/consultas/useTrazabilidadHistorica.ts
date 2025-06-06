import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { TrazabilidadCultivoReporte, SnapshotTrazabilidad, ResumenTrazabilidad } from '@/components/finanzas/trazabilidad/Types';

const apiUrl = import.meta.env.VITE_API_URL;

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
  })) || [],
  costo_mano_obra_acumulado: data.costo_mano_obra_acumulado ?? 0,
  egresos_insumos_acumulado: data.egresos_insumos_acumulado ?? 0,
  ingresos_ventas_acumulado: data.ingresos_ventas_acumulado ?? 0,
  beneficio_costo_acumulado: Number(data.beneficio_costo_acumulado) || 0,
  total_cantidad_producida_base_acumulado: data.total_cantidad_producida_base_acumulado ?? 0,
  precio_minimo_venta_por_unidad_acumulado: data.precio_minimo_venta_por_unidad_acumulado ?? 0,
  costo_incremental_ultima_cosecha: data.costo_incremental_ultima_cosecha ?? 0,
  cantidad_incremental_ultima_cosecha: data.cantidad_incremental_ultima_cosecha ?? 0,
  precio_minimo_incremental_ultima_cosecha: data.precio_minimo_incremental_ultima_cosecha ?? 0,
  precio_minimo_recuperar_inversion: data.precio_minimo_recuperar_inversion ?? 0,
  stock_disponible_total: data.stock_disponible_total ?? 0,
  resumen: {
    ...data.resumen,
    costo_total_acumulado: data.resumen?.costo_total_acumulado ?? 0,
    balance_acumulado: data.resumen?.balance_acumulado ?? 0,
  }
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
  const transformedDatosActuales = transformarDatosTrazabilidad(data.datos_actuales);
  return {
    ...data, 
    datos_actuales: transformedDatosActuales 
  } as ResumenTrazabilidad;
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
  return useQuery<TrazabilidadCultivoReporte, Error>({
    queryKey: ["trazabilidadActual", plantacionId],
    queryFn: () => fetchTrazabilidadActual(plantacionId),
    enabled: !!plantacionId,
    staleTime: 1000 * 60 * 5,
  });
};

export const useResumenActual = (plantacionId: number) => {
  return useQuery<ResumenTrazabilidad, Error>({
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