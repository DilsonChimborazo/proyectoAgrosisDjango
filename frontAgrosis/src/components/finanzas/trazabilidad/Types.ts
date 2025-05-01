interface DetalleActividad {
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

export type { DetalleActividad };


interface DetalleInsumo {
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

export type { DetalleInsumo };

interface DetalleVenta {
    cantidad: number;
    precio_unidad: number;
    ingreso_total: number;
    fecha: string;
    unidad_medida?: string;
    produccion_asociada?: string;
}

export type { DetalleVenta };

interface Resumen {
    total_actividades: number;
    total_controles: number;
    total_ventas: number;
    total_insumos: number;
    costo_total: number;
    balance: number;
}

export type { Resumen };

interface TrazabilidadCultivoReporte {
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

    [key: string]: any;
}

export type { TrazabilidadCultivoReporte };

interface SnapshotTrazabilidad {
    id: number;
    fecha_registro: string;
    version: number;
    trigger?: string;
    datos: TrazabilidadCultivoReporte;
}

export type { SnapshotTrazabilidad };

interface ResumenTrazabilidad {
    ultima_actualizacion: string;
    datos_actuales: TrazabilidadCultivoReporte;
}

export type { ResumenTrazabilidad };