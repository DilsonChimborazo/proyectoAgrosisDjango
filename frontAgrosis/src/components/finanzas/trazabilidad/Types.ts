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

interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';
    factor_conversion: number;
}

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
    costo_total_acumulado: number; 
    balance_acumulado: number;     
}

export type { Resumen };

interface TrazabilidadCultivoReporte {
    plantacion_id: number;
    cultivo: string;
    especie?: string;
    fecha_plantacion: string;
    era?: string;
    lote?: string;
    
    // Campos acumulados
    total_tiempo_minutos: number;
    total_horas: number;
    jornales: number;
    costo_mano_obra_acumulado: number;
    egresos_insumos_acumulado: number;   
    ingresos_ventas_acumulado: number;   
    beneficio_costo_acumulado: number;   
    total_cantidad_producida_base_acumulado: number; 
    precio_minimo_venta_por_unidad_acumulado: number; 

    detalle_actividades: DetalleActividad[];
    detalle_insumos: DetalleInsumo[];
    detalle_ventas: DetalleVenta[];
    resumen: Resumen;

    // Campos incrementales
    costo_incremental_ultima_cosecha: number;
    cantidad_incremental_ultima_cosecha: number;
    precio_minimo_incremental_ultima_cosecha: number;

    // Nuevo campo: Precio Mínimo para Recuperar Inversión
    precio_minimo_recuperar_inversion: number;
    stock_disponible_total: number; // Para mostrar el stock disponible total que debe cubrir la pérdida

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
    precio_minimo_venta_por_unidad: number; 
}

export type { ResumenTrazabilidad };