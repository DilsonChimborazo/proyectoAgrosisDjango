import VentanaModal from "@/components/globales/VentanasModales";
import GraficosTrazabilidad from './GraficosTrazabilidad';
import { generarAnalisisDiferencias } from './utils';
import { SnapshotTrazabilidad, DetalleActividad, DetalleInsumo, DetalleVenta } from './Types';

interface ModalesTrazabilidadProps {
    modalAbierto: { tipo: string, data: any } | null;
    comparando: number[];
    onCerrarModal: () => void;
}

// Función utilitaria para formatear números de manera segura
const safeNumberFormat = (value: any, options: { 
    decimals?: number, 
    isCurrency?: boolean 
} = {}): string => {
    const { decimals = 2, isCurrency = false } = options;
    const num = typeof value === 'number' ? value : parseFloat(value);
    const formatted = isNaN(num) ? 0 : num;
    
    if (isCurrency) {
        return `$${formatted.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        })}`;
    }
    
    return formatted.toFixed(decimals);
};

const ModalesTrazabilidad = ({ modalAbierto, comparando, onCerrarModal }: ModalesTrazabilidadProps) => {
    if (!modalAbierto) return null;

    const renderModalContent = () => {
        const { tipo, data } = modalAbierto;

        switch (tipo) {
            case 'beneficio':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Detalle de Rentabilidad</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Relación Beneficio/Costo:</span>
                                    <span className="font-medium">{safeNumberFormat(data.beneficio_costo)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ingresos por ventas:</span>
                                    <span className="font-medium">{safeNumberFormat(data.ingresos_ventas, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos totales:</span>
                                    <span className="font-medium">{safeNumberFormat(data.egresos_totales, { isCurrency: true })}</span>
                                </div>
                                <div className="border-t border-green-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance neto:</span>
                                    <span className={data.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(data.balance, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'finanzas':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Detalle Financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Ingresos totales:</span>
                                    <span className="font-medium">{safeNumberFormat(data.ingresos_ventas, { isCurrency: true })}</span>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Costo mano de obra</p>
                                        <p>{safeNumberFormat(data.costo_mano_obra, { isCurrency: true })}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Egresos por insumos</p>
                                        <p>{safeNumberFormat(data.egresos_insumos, { isCurrency: true })}</p>
                                    </div>
                                </div>
                                <div className="border-t border-blue-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance final:</span>
                                    <span className={data.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(data.balance, { isCurrency: true })}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'tiempo':
                return (
                    <div className="space-y-4">
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                            <h4 className="font-semibold text-purple-800 mb-2">Detalle de Tiempo</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-500">Total horas trabajadas</p>
                                    <p className="text-xl font-bold">{safeNumberFormat(data.total_horas)} hrs</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Total jornales</p>
                                    <p className="text-xl font-bold">{safeNumberFormat(data.jornales)}</p>
                                </div>
                            </div>
                            {data.detalle_actividades?.length > 0 && (
                                <>
                                    <div className="border-t border-purple-200 my-3"></div>
                                    <p className="text-sm text-gray-500">Actividades registradas:</p>
                                    <p className="font-medium">{data.detalle_actividades.length}</p>
                                </>
                            )}
                        </div>
                    </div>
                );

            case 'resumen':
                return (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Fecha de plantación</p>
                                <p className="font-medium">{data.fecha_plantacion || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Especie</p>
                                <p className="font-medium">{data.especie || 'No especificado'}</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Tiempo total invertido</p>
                                <p className="font-medium">{safeNumberFormat(data.total_horas)} horas ({safeNumberFormat(data.jornales)} jornales)</p>
                            </div>
                            <div className="bg-gray-50 p-4 rounded-lg">
                                <p className="text-sm text-gray-500">Costo mano de obra</p>
                                <p className="font-medium">{safeNumberFormat(data.costo_mano_obra, { isCurrency: true })}</p>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                            <h4 className="font-semibold text-green-800 mb-2">Resumen financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Ingresos por ventas:</span>
                                    <span className="font-medium">{safeNumberFormat(data.ingresos_ventas, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos por insumos:</span>
                                    <span className="font-medium">{safeNumberFormat(data.egresos_insumos, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Costo mano de obra:</span>
                                    <span className="font-medium">{safeNumberFormat(data.costo_mano_obra, { isCurrency: true })}</span>
                                </div>
                                <div className="border-t border-green-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance total:</span>
                                    <span className={(data.ingresos_ventas || 0) - ((data.costo_mano_obra || 0) + (data.egresos_insumos || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(
                                            (data.ingresos_ventas || 0) - ((data.costo_mano_obra || 0) + (data.egresos_insumos || 0)), 
                                            { isCurrency: true }
                                        )}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'evolucion':
                return <GraficosTrazabilidad data={data} tipo="evolucion" />;

            case 'comparar':
                if (!data || data.length < 2)
                    return <p>Se necesitan al menos 2 versiones para comparar</p>;

                const snapshotsAComparar = comparando.length >= 2
                    ? data.filter((s: SnapshotTrazabilidad) => comparando.includes(s.id))
                    : [data[0], data[data.length - 1]];

                const camposComparacion = [
                    { 
                        key: 'beneficio_costo', 
                        label: 'Relación B/C', 
                        format: (v: any) => safeNumberFormat(v) 
                    },
                    { 
                        key: 'ingresos_ventas', 
                        label: 'Ingresos', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true }) 
                    },
                    { 
                        key: 'egresos_insumos', 
                        label: 'Egresos Insumos', 
                        format: (v: any) => safeNumberFormat(v, { isCurrency: true }) 
                    },
                    { 
                        key: 'costo_mano_obra', 
                        label: 'Costo Mano Obra', 
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
                                                {campo.format(s.datos[campo.key as keyof typeof s.datos])}
                                            </td>
                                        ))}
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            {(() => {
                                                const val1 = Number(snapshotsAComparar[0].datos[campo.key]) || 0;
                                                const val2 = Number(snapshotsAComparar[1].datos[campo.key]) || 0;
                                                return campo.format(val2 - val1);
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
                        </div>

                        <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                            <h4 className="font-semibold text-blue-800 mb-2">Resumen financiero</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span>Relación B/C:</span>
                                    <span className="font-medium">{safeNumberFormat(snapshotData.datos.beneficio_costo)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ingresos:</span>
                                    <span className="font-medium">{safeNumberFormat(snapshotData.datos.ingresos_ventas, { isCurrency: true })}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Egresos totales:</span>
                                    <span className="font-medium">{safeNumberFormat(
                                        (snapshotData.datos.costo_mano_obra || 0) + (snapshotData.datos.egresos_insumos || 0), 
                                        { isCurrency: true }
                                    )}</span>
                                </div>
                                <div className="border-t border-blue-200 my-2"></div>
                                <div className="flex justify-between font-semibold">
                                    <span>Balance:</span>
                                    <span className={(snapshotData.datos.ingresos_ventas || 0) - ((snapshotData.datos.costo_mano_obra || 0) + (snapshotData.datos.egresos_insumos || 0)) >= 0 ? 'text-green-600' : 'text-red-600'}>
                                        {safeNumberFormat(
                                            (snapshotData.datos.ingresos_ventas || 0) - ((snapshotData.datos.costo_mano_obra || 0) + (snapshotData.datos.egresos_insumos || 0)), 
                                            { isCurrency: true }
                                        )}
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
            titulo={`${modalAbierto.tipo.charAt(0).toUpperCase() + modalAbierto.tipo.slice(1)}`}
            size={modalAbierto.tipo === 'comparar' ? 'xl' : 'lg'}
            contenido={renderModalContent()}
        />
    );
};

export default ModalesTrazabilidad;