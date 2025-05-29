import VentanaModal from "@/components/globales/VentanasModales";
import GraficosTrazabilidad from './GraficosTrazabilidad'; 
import { generarAnalisisDiferencias } from './utils';
import { SnapshotTrazabilidad, DetalleActividad, DetalleInsumo, DetalleVenta, TrazabilidadCultivoReporte } from './Types';

interface ModalesTrazabilidadProps {
    modalAbierto: { tipo: string, data: any } | null;
    comparando: number[];
    onCerrarModal: () => void;
}

// Función utilitaria para formatear números de manera segura con localización es-CO
const safeNumberFormat = (
    value: any,
    options: { 
        decimals?: number; 
        isCurrency?: boolean;
        minimumFractionDigits?: number; // Añadido para toLocaleString
        maximumFractionDigits?: number; // Añadido para toLocaleString
        useGrouping?: boolean; // Añadido para toLocaleString
    } = {}
): string => {
    const { 
        decimals = 2, 
        isCurrency = false,
        minimumFractionDigits,
        maximumFractionDigits,
        useGrouping,
    } = options;
    const num = typeof value === 'number' ? value : parseFloat(value);
    const formatted = isNaN(num) ? 0 : num;
    
    const locale = 'es-CO'; // Forzar formato colombiano (punto para miles, coma para decimales)
    
    const toLocaleOptions: Intl.NumberFormatOptions = {
        minimumFractionDigits: minimumFractionDigits ?? decimals,
        maximumFractionDigits: maximumFractionDigits ?? decimals,
        useGrouping: useGrouping ?? true,
    };

    if (isCurrency) {
        return `$${formatted.toLocaleString(locale, toLocaleOptions)}`;
    }
    
    return formatted.toLocaleString(locale, toLocaleOptions);
};


const ModalesTrazabilidad = ({ modalAbierto, comparando, onCerrarModal }: ModalesTrazabilidadProps) => {
    if (!modalAbierto) return null;

    const renderModalContent = () => {
        const { tipo, data } = modalAbierto;

        switch (tipo) {
            case 'beneficio':
                const beneficioData = data as TrazabilidadCultivoReporte; 
                const egresosTotalesBeneficio = (beneficioData.costo_mano_obra_acumulado || 0) + (beneficioData.egresos_insumos_acumulado || 0);
                const balanceBeneficio = (beneficioData.ingresos_ventas_acumulado || 0) - egresosTotalesBeneficio;

                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Detalle de Rentabilidad</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Relación Beneficio/Costo:</span>
                                    <span className="font-medium">{safeNumberFormat(beneficioData.beneficio_costo_acumulado)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ingresos por ventas:</span>
                                    <span className="font-medium">{safeNumberFormat(beneficioData.ingresos_ventas_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos totales:</span>
                                    <span className="font-medium">{safeNumberFormat(egresosTotalesBeneficio, { isCurrency: true })}</span>
                                </div>
                                <div className="border-t border-green-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance neto:</span>
                                    <span className={balanceBeneficio >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(balanceBeneficio, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'finanzas':
                const finanzasData = data as TrazabilidadCultivoReporte;
                const balanceFinanzas = (finanzasData.ingresos_ventas_acumulado || 0) - ((finanzasData.costo_mano_obra_acumulado || 0) + (finanzasData.egresos_insumos_acumulado || 0));

                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Detalle Financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Ingresos totales:</span>
                                    <span className="font-medium">{safeNumberFormat(finanzasData.ingresos_ventas_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Costo mano de obra (Acum.)</p>
                                        <p>{safeNumberFormat(finanzasData.costo_mano_obra_acumulado, { isCurrency: true })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Egresos por insumos (Acum.)</p>
                                        <p>{safeNumberFormat(finanzasData.egresos_insumos_acumulado, { isCurrency: true })}</p>
                                    </div>
                                </div>
                                <div className="border-t border-blue-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance final:</span>
                                    <span className={balanceFinanzas >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(balanceFinanzas, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'tiempo':
                const tiempoData = data as TrazabilidadCultivoReporte;
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Detalle de Tiempo</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total horas trabajadas</p>
                                    <p className="text-xl font-bold">{safeNumberFormat(tiempoData.total_horas)} hrs</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total jornales</p>
                                    <p className="text-xl font-bold">{safeNumberFormat(tiempoData.jornales)}</p>
                                </div>
                            </div>
                            {tiempoData.detalle_actividades?.length > 0 && (
                                <>
                                    <div className="border-t border-purple-200 my-3"></div>
                                    <p className="text-sm text-gray-500">Actividades registradas:</p>
                                    <p className="font-medium">{tiempoData.detalle_actividades.length}</p>
                                </>
                            )}
                        </div>
                    </div>
                );
            
            case 'precioMinimoAcumulado': 
                const precioMinimoAcumuladoData = data as TrazabilidadCultivoReporte; 
                const costoTotalAcumulado = (precioMinimoAcumuladoData.costo_mano_obra_acumulado || 0) + (precioMinimoAcumuladoData.egresos_insumos_acumulado || 0);

                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                            <h4 className="font-semibold text-teal-800 mb-2">Detalle de Precio Mínimo de Venta (Acumulado)</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Costo total acumulado de la plantación:</span>
                                    <span className="font-medium">{safeNumberFormat(costoTotalAcumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cantidad total producida (unidad base):</span>
                                    <span className="font-medium">{safeNumberFormat(precioMinimoAcumuladoData.total_cantidad_producida_base_acumulado, { decimals: 1 })}</span>
                                </div>
                                <div className="border-t border-teal-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Precio Mínimo de Venta por Unidad (Acumulado):</span>
                                    <span className="text-teal-600">
                                        {safeNumberFormat(precioMinimoAcumuladoData.precio_minimo_venta_por_unidad_acumulado, { isCurrency: true, decimals: 2 })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Este es el precio por unidad base necesario para cubrir los costos **totales acumulados** de la plantación hasta la fecha.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            
            case 'precioMinimoIncremental': 
                const precioMinimoIncrementalData = data as TrazabilidadCultivoReporte;
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                            <h4 className="font-semibold text-orange-800 mb-2">Detalle de Precio Mínimo de Venta (Última Cosecha)</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Costo incremental del período:</span>
                                    <span className="font-medium">{safeNumberFormat(precioMinimoIncrementalData.costo_incremental_ultima_cosecha, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Cantidad de la última cosecha (unidad base):</span>
                                    <span className="font-medium">{safeNumberFormat(precioMinimoIncrementalData.cantidad_incremental_ultima_cosecha, { decimals: 1 })}</span>
                                </div>
                                <div className="border-t border-orange-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Precio Mínimo de Venta por Unidad (Última Cosecha):</span>
                                    <span className="text-orange-600">
                                        {safeNumberFormat(precioMinimoIncrementalData.precio_minimo_incremental_ultima_cosecha, { isCurrency: true, decimals: 2 })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Este es el precio por unidad base necesario para cubrir los costos **desde la última producción** hasta la más reciente. Puede ser cero si no hubo nuevos gastos en ese período.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'precioMinimoRecuperar': // Nuevo Modal para el precio mínimo de recuperación
                const precioMinimoRecuperarData = data as TrazabilidadCultivoReporte;
                const costoNetoPendiente = Math.max(0, (precioMinimoRecuperarData.costo_mano_obra_acumulado || 0) + (precioMinimoRecuperarData.egresos_insumos_acumulado || 0) - (precioMinimoRecuperarData.ingresos_ventas_acumulado || 0));

                return (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${precioMinimoRecuperarData.precio_minimo_recuperar_inversion > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
                            <h4 className="font-semibold text-gray-800 mb-2">Detalle de Precio Mínimo de Venta (Recuperar Inversión)</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Costo total acumulado:</span>
                                    <span className="font-medium">{safeNumberFormat((precioMinimoRecuperarData.costo_mano_obra_acumulado || 0) + (precioMinimoRecuperarData.egresos_insumos_acumulado || 0), { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ingresos por ventas acumulados:</span>
                                    <span className="font-medium">{safeNumberFormat(precioMinimoRecuperarData.ingresos_ventas_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Costo neto pendiente de recuperar:</span>
                                    <span className={`font-medium ${costoNetoPendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {safeNumberFormat(costoNetoPendiente, { isCurrency: true })}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Stock disponible para cubrir:</span>
                                    <span className="font-medium">{safeNumberFormat(precioMinimoRecuperarData.stock_disponible_total, { decimals: 2 })} unidades base</span>
                                </div>
                                <div className="border-t border-gray-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Precio Mínimo de Venta por Unidad (Recuperar Inversión):</span>
                                    <span className={`${precioMinimoRecuperarData.precio_minimo_recuperar_inversion > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {safeNumberFormat(precioMinimoRecuperarData.precio_minimo_recuperar_inversion, { isCurrency: true, decimals: 2 })}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-2">
                                    Este es el precio por unidad base al que debes vender el **stock actualmente disponible** para recuperar **todas las pérdidas acumuladas** de la plantación. Si es cero, la inversión ya está recuperada.
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 'resumen':
                const resumenData = data as TrazabilidadCultivoReporte;
                const costoTotalResumen = (resumenData.costo_mano_obra_acumulado || 0) + (resumenData.egresos_insumos_acumulado || 0);

                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Fecha de plantación</p>
                                <p className="font-medium">{resumenData.fecha_plantacion || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Especie</p>
                                <p className="font-medium">{resumenData.especie || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Tiempo total invertido</p>
                                <p className="font-medium">{safeNumberFormat(resumenData.total_horas)} hrs ({safeNumberFormat(resumenData.jornales)} jornales)</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Costo mano de obra (Acum.)</p>
                                <p className="font-medium">{safeNumberFormat(resumenData.costo_mano_obra_acumulado, { isCurrency: true })}</p>
                            </div>
                            {/* Mostrar el Precio Mínimo de Venta por Unidad ACUMULADO en el resumen general */}
                            <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Acum.)</p>
                                <p className="font-medium text-teal-600">
                                    {safeNumberFormat(resumenData.precio_minimo_venta_por_unidad_acumulado, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                             {/* Mostrar el Precio Mínimo de Venta por Unidad INCREMENTAL en el resumen general */}
                             <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Última Cosecha)</p>
                                <p className="font-medium text-orange-600">
                                    {safeNumberFormat(resumenData.precio_minimo_incremental_ultima_cosecha, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                            {/* Mostrar el Precio Mínimo para Recuperar Inversión en el resumen general */}
                            <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Recuperar Inversión)</p>
                                <p className={`font-medium ${resumenData.precio_minimo_recuperar_inversion > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {safeNumberFormat(resumenData.precio_minimo_recuperar_inversion, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Resumen financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Ingresos por ventas:</span>
                                    <span className="font-medium">{safeNumberFormat(resumenData.ingresos_ventas_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos por insumos:</span>
                                    <span className="font-medium">{safeNumberFormat(resumenData.egresos_insumos_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Costo mano de obra:</span>
                                    <span className="font-medium">{safeNumberFormat(resumenData.costo_mano_obra_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>**Costo Total Acumulado:**</span>
                                    <span className="font-medium">{safeNumberFormat(costoTotalResumen, { isCurrency: true })}</span>
                                </div>
                                <div className="border-t border-green-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance total:</span>
                                    <span className={resumenData.balance_acumulado >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(resumenData.balance_acumulado, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'evolucion':
                return <GraficosTrazabilidad data={data} tipo="evolucion" />;

            case 'comparar':
                const snapshotsData = data as SnapshotTrazabilidad[]; 
                if (!snapshotsData || snapshotsData.length < 2)
                    return <p>Se necesitan al menos 2 versiones para comparar</p>;

                const snapshotsAComparar = comparando.length >= 2
                    ? snapshotsData.filter((s: SnapshotTrazabilidad) => comparando.includes(s.id))
                    : [snapshotsData[0], snapshotsData[snapshotsData.length - 1]];

                const camposComparacion = [
                    { 
                        key: 'beneficio_costo_acumulado', 
                        label: 'Relación B/C (Acum.)', 
                        format: (v: any) => safeNumberFormat(v) 
                    },
                    { 
                        key: 'ingresos_ventas_acumulado', 
                        label: 'Ingresos (Acum.)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true }) 
                    },
                    { 
                        key: 'egresos_insumos_acumulado', 
                        label: 'Egresos Insumos (Acum.)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true }) 
                    },
                    { 
                        key: 'costo_mano_obra_acumulado', 
                        label: 'Costo Mano Obra (Acum.)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true }) 
                    },
                    { 
                        key: 'total_horas', 
                        label: 'Horas Trabajadas', 
                        format: (v: any) => safeNumberFormat(v) 
                    },
                    { 
                        key: 'jornales', 
                        label: 'Jornales', 
                        format: (v: any) => safeNumberFormat(v) 
                    },
                    { 
                        key: 'precio_minimo_venta_por_unidad_acumulado', 
                        label: 'Precio Mín. Venta/Unidad (Acum.)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true, decimals: 2 }) 
                    },
                    { 
                        key: 'precio_minimo_incremental_ultima_cosecha', 
                        label: 'Precio Mín. Venta/Unidad (Última Cosecha)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true, decimals: 2 }) 
                    },
                    { 
                        key: 'precio_minimo_recuperar_inversion', 
                        label: 'Precio Mín. Venta/Unidad (Recuperar Inversión)', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true, decimals: 2 }) 
                    }
                ];

                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Métrica</th>
                                    {snapshotsAComparar.map((s: SnapshotTrazabilidad) => (
                                        <th key={s.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            v{s.version} - {new Date(s.fecha_registro).toLocaleDateString()}
                                        </th>
                                    ))}
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Diferencia</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {camposComparacion.map(campo => (
                                    <tr key={campo.key}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campo.label}</td>
                                        {snapshotsAComparar.map((s: SnapshotTrazabilidad) => (
                                            <td key={`${s.id}-${campo.key}`} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {campo.format(s.datos[campo.key as keyof TrazabilidadCultivoReporte])}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {(() => {
                                                const val1 = Number(snapshotsAComparar[0].datos[campo.key as keyof TrazabilidadCultivoReporte]) || 0;
                                                const val2 = Number(snapshotsAComparar[1].datos[campo.key as keyof TrazabilidadCultivoReporte]) || 0;
                                                const diff = val2 - val1;
                                                const isCurrencyField = ['precio_minimo_venta_por_unidad_acumulado', 'precio_minimo_incremental_ultima_cosecha', 'precio_minimo_recuperar_inversion', 'ingresos_ventas_acumulado', 'egresos_insumos_acumulado', 'costo_mano_obra_acumulado'].includes(campo.key);
                                                const decimals = (campo.key === 'precio_minimo_venta_por_unidad_acumulado' || campo.key === 'precio_minimo_incremental_ultima_cosecha' || campo.key === 'precio_minimo_recuperar_inversion') ? 4 : 2;
                                                
                                                return safeNumberFormat(diff, { isCurrency: isCurrencyField, decimals: decimals });
                                            })()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {comparando.length >= 2 && (
                            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                                <h4 className="font-semibold text-blue-800 mb-2">Análisis de diferencias</h4>
                                <p className="text-sm text-gray-700">
                                    {generarAnalisisDiferencias(snapshotsAComparar[0].datos, snapshotsAComparar[1].datos)}
                                </p>
                            </div>
                        )}
                    </div>
                );

            case 'actividad':
                const actividadData = data as DetalleActividad;
                return (
                    <div className="space-y-3">
                        <p><strong>Actividad:</strong> {actividadData.actividad || 'Sin nombre'}</p>
                        <p><strong>Estado:</strong> {actividadData.estado || 'Sin estado'}</p>
                        <p><strong>Fecha programada:</strong> {actividadData.fecha_programada || 'Sin fecha'}</p>
                        {actividadData.fecha_realizada && <p><strong>Fecha realizada:</strong> {actividadData.fecha_realizada}</p>}
                        <p><strong>Duración:</strong> {actividadData.duracion_minutos || '0'} min</p>
                        {actividadData.observaciones && <p><strong>Observaciones:</strong> {actividadData.observaciones}</p>}
                    </div>
                );

            case 'insumo':
                const insumoData = data as DetalleInsumo;
                return (
                    <div className="space-y-3">
                        <p><strong>Nombre:</strong> {insumoData.nombre || 'Sin nombre'}</p>
                        <p><strong>Tipo:</strong> {insumoData.tipo_insumo || 'Sin tipo'}</p>
                        <p><strong>Cantidad:</strong> {insumoData.cantidad || '0'} {insumoData.unidad_medida || ''}</p>
                        <p><strong>Costo total:</strong> {safeNumberFormat(insumoData.costo_total, { isCurrency: true })}</p>
                        {insumoData.actividad_asociada && <p><strong>Actividad asociada:</strong> {insumoData.actividad_asociada}</p>}
                    </div>
                );

            case 'venta':
                const ventaData = data as DetalleVenta;
                return (
                    <div className="space-y-3">
                        <p><strong>Fecha:</strong> {ventaData.fecha || 'Sin fecha'}</p>
                        <p><strong>Cantidad:</strong> {ventaData.cantidad || '0'} {ventaData.unidad_medida || ''}</p>
                        <p><strong>Precio unitario:</strong> {safeNumberFormat(ventaData.precio_unidad, { isCurrency: true })}</p>
                        <p><strong>Total:</strong> {safeNumberFormat(ventaData.ingreso_total, { isCurrency: true })}</p>
                    </div>
                );
            
            case 'snapshot':
                const snapshotData = data as SnapshotTrazabilidad;
                const costoTotalSnapshot = (snapshotData.datos.costo_mano_obra_acumulado || 0) + (snapshotData.datos.egresos_insumos_acumulado || 0);
                const costoNetoPendienteSnapshot = Math.max(0, (snapshotData.datos.costo_mano_obra_acumulado || 0) + (snapshotData.datos.egresos_insumos_acumulado || 0) - (snapshotData.datos.ingresos_ventas_acumulado || 0));


                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Versión</p>
                                <p className="font-medium">v{snapshotData.version}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Fecha registro</p>
                                <p className="font-medium">{new Date(snapshotData.fecha_registro).toLocaleDateString()}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Trigger</p>
                                <p className="font-medium">{snapshotData.trigger || 'Manual'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Acum.)</p>
                                <p className="font-medium text-teal-600">
                                    {safeNumberFormat(snapshotData.datos.precio_minimo_venta_por_unidad_acumulado, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Última Cosecha)</p>
                                <p className="font-medium text-orange-600">
                                    {safeNumberFormat(snapshotData.datos.precio_minimo_incremental_ultima_cosecha, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                             <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Precio Mínimo Venta/Unidad (Recuperar Inversión)</p>
                                <p className={`font-medium ${snapshotData.datos.precio_minimo_recuperar_inversion > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {safeNumberFormat(snapshotData.datos.precio_minimo_recuperar_inversion, { isCurrency: true, decimals: 2 })}
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Resumen financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Relación B/C (Acum.):</span>
                                    <span className="font-medium">{safeNumberFormat(snapshotData.datos.beneficio_costo_acumulado)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ingresos (Acum.):</span>
                                    <span className="font-medium">{safeNumberFormat(snapshotData.datos.ingresos_ventas_acumulado, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos totales (Acum.):</span>
                                    <span className="font-medium">{safeNumberFormat(costoTotalSnapshot, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Costo neto pendiente de recuperar:</span>
                                    <span className={`font-medium ${costoNetoPendienteSnapshot > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {safeNumberFormat(costoNetoPendienteSnapshot, { isCurrency: true })}
                                    </span>
                                </div>
                                <div className="border-t border-blue-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance (Acum.):</span>
                                    <span className={snapshotData.datos.balance_acumulado >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(snapshotData.datos.balance_acumulado, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <p>Información detallada no disponible</p>;
        }
    };

    return (
        <VentanaModal
            isOpen={true}
            onClose={onCerrarModal}
            titulo={`${modalAbierto.tipo.charAt(0).toUpperCase() + modalAbierto.tipo.slice(1).replace('MinimoAcumulado', 'Mínimo Acumulado').replace('MinimoIncremental', 'Mínimo Incremental').replace('MinimoRecuperar', 'Mínimo Recuperar')}`}
            size={modalAbierto.tipo === 'comparar' ? 'xl' : 'lg'}
            contenido={renderModalContent()}
        />
    );
};

export default ModalesTrazabilidad;