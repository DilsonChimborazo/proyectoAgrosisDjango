import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

// Interfaces exportadas para poder usarlas en otros archivos
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

export interface TrazabilidadCultivoReporte {
    cultivo: string;
    fecha_plantacion: string;
    especie?: string;
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

const fetchTrazabilidadCultivo = async (cultivoId: number): Promise<TrazabilidadCultivoReporte> => {
    try {
        const { data } = await axios.get(`${apiUrl}finanzas/nomina/trazabilidad/${cultivoId}/`);
        return {
            ...data,
            fecha_plantacion: new Date(data.fecha_plantacion).toLocaleDateString(),
            detalle_actividades: data.detalle_actividades.map((act: any) => ({
                ...act,
                fecha_programada: new Date(act.fecha_programada).toLocaleDateString(),
                fecha_realizada: act.fecha_realizada ? new Date(act.fecha_realizada).toLocaleDateString() : undefined
            })),
            detalle_insumos: data.detalle_insumos.map((ins: any) => ({
                ...ins,
                fecha: new Date(ins.fecha).toLocaleDateString()
            })),
            detalle_ventas: data.detalle_ventas.map((ven: any) => ({
                ...ven,
                fecha: new Date(ven.fecha).toLocaleDateString()
            }))
        };
    } catch (error) {
        console.error("Error al obtener el reporte de trazabilidad del cultivo:", error);
        throw new Error("No se pudo obtener el reporte");
    }
};

export const useTrazabilidadCultivo = (cultivoId: number) => {
    return useQuery<TrazabilidadCultivoReporte, Error>({
        queryKey: ["trazabilidadCultivo", cultivoId],
        queryFn: () => fetchTrazabilidadCultivo(cultivoId),
        staleTime: 1000 * 60 * 10, // 10 minutes
        enabled: !!cultivoId, // Only run if cultivoId exists
    });
};