// hooks/finanzas/useTrazabilidadHistorica.ts
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

// Interfaces extendidas para la nueva funcionalidad
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

// Reutilizamos las interfaces anteriores y añadimos:
const fetchTrazabilidadActual = async (plantacionId: number) => {
    const { data } = await axios.get(`${apiUrl}trazabilidad/plantacion/${plantacionId}/`);
    return transformarDatosTrazabilidad(data);
};

const fetchResumenActual = async (plantacionId: number) => {
    const { data } = await axios.get(`${apiUrl}resumen-actual/${plantacionId}/`);
    return transformarDatosTrazabilidad(data.datos_actuales);
};

const fetchHistorialTrazabilidad = async (plantacionId: number) => {
    const { data } = await axios.get(`${apiUrl}trazabilidad/historico/${plantacionId}/`);
    return data.results.map((snapshot: any) => ({
        ...snapshot,
        datos: transformarDatosTrazabilidad(snapshot.datos)
    }));
};



// Función para transformar fechas en los datos
const transformarDatosTrazabilidad = (data: any) => {
    return {
        ...data,
        fecha_plantacion: new Date(data.fecha_plantacion).toLocaleDateString(),
        detalle_actividades: data.detalle_actividades?.map((act: any) => ({
            ...act,
            fecha_programada: new Date(act.fecha_programada).toLocaleDateString(),
            fecha_realizada: act.fecha_realizada ? new Date(act.fecha_realizada).toLocaleDateString() : undefined
        })) || [],
        detalle_insumos: data.detalle_insumos?.map((ins: any) => ({
            ...ins,
            fecha: new Date(ins.fecha).toLocaleDateString()
        })) || [],
        detalle_ventas: data.detalle_ventas?.map((ven: any) => ({
            ...ven,
            fecha: new Date(ven.fecha).toLocaleDateString()
        })) || []
    };
};

export const useTrazabilidadActual = (plantacionId: number) => {
    return useQuery({
        queryKey: ["trazabilidadActual", plantacionId],
        queryFn: () => fetchTrazabilidadActual(plantacionId),
        enabled: !!plantacionId,
        staleTime: 1000 * 60 * 5 // 5 minutos
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