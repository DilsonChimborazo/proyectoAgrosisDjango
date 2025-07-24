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

interface DetalleInsumo {
  tipo: string;
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

interface DetalleVenta {
  cantidad: number;
  precio_unidad_con_descuento: number;
  total: number;
  fecha: string;
  unidad_medida?: string;
  produccion_asociada?: string;
}

interface DetalleHerramienta {
  herramienta: string;
  cantidad: number;
  depreciacion: number;
  fecha: string;
  actividad_asociada: string;
}

interface Resumen {
  total_actividades: number;
  total_controles: number;
  total_ventas: number;
  total_insumos: number;
  total_herramientas: number;
  costo_total_acumulado: number;
  balance_acumulado: number;
}

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
  costo_mano_obra_acumulado: number;
  egresos_insumos_acumulado: number;
  depreciacion_herramientas_acumulada: number;
  ingresos_ventas_acumulado: number;
  beneficio_costo_acumulado: number;
  total_cantidad_producida_base_acumulado: number;
  precio_minimo_venta_por_unidad_acumulado: number;
  balance_acumulado: number;
  costo_incremental_ultima_cosecha: number;
  cantidad_incremental_ultima_cosecha: number;
  precio_minimo_incremental_ultima_cosecha: number;
  precio_minimo_recuperar_inversion: number;
  stock_disponible_total: number;
  unidad_base?: string;
  detalle_actividades: DetalleActividad[];
  detalle_insumos: DetalleInsumo[];
  detalle_ventas: DetalleVenta[];
  detalle_herramientas: DetalleHerramienta[];
  resumen: Resumen;
}

interface SnapshotTrazabilidad {
  id: number;
  fecha_registro: string;
  version: number;
  trigger?: string;
  datos: TrazabilidadCultivoReporte;
}

interface ResumenTrazabilidad {
  ultima_actualizacion: string;
  datos_actuales: TrazabilidadCultivoReporte;
  precio_minimo_venta_por_unidad: number;
}

export type {
  DetalleActividad,
  DetalleInsumo,
  DetalleVenta,
  DetalleHerramienta,
  Resumen,
  TrazabilidadCultivoReporte,
  SnapshotTrazabilidad,
  ResumenTrazabilidad,
};