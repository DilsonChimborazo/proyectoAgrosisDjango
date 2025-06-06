import Tabla from '@/components/globales/Tabla';
import Button from '@/components/globales/Button';
import { ChevronDown, ChevronUp, BarChart2, DollarSign, Clock, Package, Activity, History, Tag, TrendingUp, RefreshCcw } from 'lucide-react'; 
import { SnapshotTrazabilidad, TrazabilidadCultivoReporte } from './Types';

interface ResumenTrazabilidadProps {
    plantacionSeleccionada: number | null;
    isLoading: boolean;
    trazabilidadData: TrazabilidadCultivoReporte | undefined;
    seccionAbierta: string | null;
    ordenarSnapshots: SnapshotTrazabilidad[];
    comparando: number[];
    onToggleSeccion: (seccion: string) => void;
    onAbrirModal: (tipo: string, data: any) => void;
    onToggleComparar: (versionId: number) => void;
}

const formatNumber = (value: any, decimals: number = 2): string => {
    const num = typeof value === 'number' ? value : parseFloat(value);
    return (isNaN(num) ? 0 : num).toFixed(decimals);
};

// Función utilitaria para formatear números de manera segura con localización es-CO
const safeNumberFormat = (
    value: any,
    options: { 
        decimals?: number;
        isCurrency?: boolean;
    } & Intl.NumberFormatOptions = {}
): string => {
    const { decimals = 2, isCurrency = false, ...formatOptions } = options;
    const num = typeof value === 'number' ? value : parseFloat(value);
    const formatted = isNaN(num) ? 0 : num;
    
    const locale = 'es-CO'; // Forzar formato colombiano (punto para miles, coma para decimales)
    
    if (isCurrency) {
        return `$${formatted.toLocaleString(locale, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
            useGrouping: true,
            ...formatOptions
        })}`;
    }
    
    return formatted.toLocaleString(locale, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
        useGrouping: true,
        ...formatOptions
    });
};

const ResumenTrazabilidad = ({
    plantacionSeleccionada,
    isLoading,
    trazabilidadData,
    seccionAbierta,
    ordenarSnapshots,
    comparando,
    onToggleSeccion,
    onAbrirModal,
    onToggleComparar
}: ResumenTrazabilidadProps) => {
    const datosParaTabla = ordenarSnapshots.map((s) => {
        const ingresos = s.datos.ingresos_ventas_acumulado || 0; 
        const costos = (s.datos.costo_mano_obra_acumulado || 0) + (s.datos.egresos_insumos_acumulado || 0); 

        return {
            versión: `v${s.version}`,
            fecha: new Date(s.fecha_registro).toLocaleDateString(),
            'b/c': formatNumber(s.datos.beneficio_costo_acumulado), 
            balance: safeNumberFormat(ingresos - costos, { isCurrency: true }), // Usar safeNumberFormat
            acciones: (
                <div className="flex gap-2">
                    <Button
                        text="Ver"
                        variant="outline"
                        size="xs"
                        onClick={() => onAbrirModal('snapshot', s)}
                    />
                    <Button
                        text={comparando.includes(s.id) ? 'Quitar' : 'Comparar'}
                        variant={comparando.includes(s.id) ? 'danger' : 'primary'}
                        size="xs"
                        onClick={() => onToggleComparar(s.id)}
                        disabled={comparando.length >= 2 && !comparando.includes(s.id)}
                    />
                </div>
            )
        };
    });

    const handleCardClick = (tipo: string) => {
        if (!trazabilidadData) return;
        onAbrirModal(tipo, trazabilidadData); 
    };

    return (
        <div className="w-full lg:w-3/4 space-y-6">
            {plantacionSeleccionada ? (
                isLoading ? (
                    <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center">
                        <div className="animate-pulse text-center">
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
                            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                        </div>
                    </div>
                ) : trazabilidadData ? (
                    <>
                        <div className="bg-white rounded-xl shadow-md overflow-hidden">
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-gray-800">
                                            {trazabilidadData.cultivo || 'Sin nombre'}
                                            <span className="text-sm text-gray-500 ml-2">
                                                (Plantado: {trazabilidadData.fecha_plantacion || 'Sin fecha'})
                                            </span>
                                        </h2>
                                        <p className="text-gray-600">
                                            {trazabilidadData.lote || 'Sin lote'} - {trazabilidadData.era || 'Sin era'}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-gray-500">
                                            Versión actual
                                        </span>
                                        <Button
                                            text="Historial"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => onToggleSeccion('historial')}
                                            icon={History}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                    <div
                                        className={`p-4 rounded-lg border ${(parseFloat(formatNumber(trazabilidadData.beneficio_costo_acumulado))) >= 1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} cursor-pointer hover:shadow-md transition`}
                                        onClick={() => handleCardClick('beneficio')}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Relación B/C</p>
                                                <p className="text-2xl font-bold mt-1">
                                                    {formatNumber(trazabilidadData.beneficio_costo_acumulado)}
                                                </p>
                                            </div>
                                            <BarChart2 className={`h-6 w-6 ${(parseFloat(formatNumber(trazabilidadData.beneficio_costo_acumulado))) >= 1 ? 'text-green-600' : 'text-red-600'}`} />
                                        </div>
                                        <p className="text-xs mt-2">
                                            {(parseFloat(formatNumber(trazabilidadData.beneficio_costo_acumulado))) >= 1 ? 'Rentable' : 'No rentable'}
                                        </p>
                                    </div>

                                    <div
                                        className="p-4 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md transition"
                                        onClick={() => handleCardClick('finanzas')}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                                <p className={`text-2xl font-bold mt-1 ${((trazabilidadData.ingresos_ventas_acumulado || 0) - ((trazabilidadData.costo_mano_obra_acumulado || 0) + (trazabilidadData.egresos_insumos_acumulado || 0))) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                                    {safeNumberFormat(((trazabilidadData.ingresos_ventas_acumulado || 0) - ((trazabilidadData.costo_mano_obra_acumulado || 0) + (trazabilidadData.egresos_insumos_acumulado || 0))), { isCurrency: true })}
                                                </p>
                                            </div>
                                            <DollarSign className="h-6 w-6 text-blue-600" />
                                        </div>
                                        <p className="text-xs mt-2">
                                            Ingresos: {safeNumberFormat((trazabilidadData.ingresos_ventas_acumulado || 0), { isCurrency: true })}
                                        </p>
                                    </div>

                                    <div
                                        className="p-4 rounded-lg border border-purple-200 bg-purple-50 cursor-pointer hover:shadow-md transition"
                                        onClick={() => handleCardClick('tiempo')}
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-sm font-medium text-gray-500">Tiempo invertido</p>
                                                <p className="text-2xl font-bold mt-1 text-purple-600">
                                                    {trazabilidadData.total_horas || '0'} hrs
                                                </p>
                                            </div>
                                            <Clock className="h-6 w-6 text-purple-600" />
                                        </div>
                                        <p className="text-xs mt-2">
                                            {trazabilidadData.jornales || '0'} jornales
                                        </p>
                                    </div>

                                    {trazabilidadData.precio_minimo_incremental_ultima_cosecha !== undefined && (
                                        <div
                                            className="p-4 rounded-lg border border-orange-200 bg-orange-50 cursor-pointer hover:shadow-md transition"
                                            onClick={() => handleCardClick('precioMinimoIncremental')}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Precio Mínimo Venta/Unidad (Última Cosecha)</p>
                                                    <p className="text-2xl font-bold mt-1 text-orange-600">
                                                        {safeNumberFormat((trazabilidadData.precio_minimo_incremental_ultima_cosecha || 0), { decimals: 4, isCurrency: true })}
                                                    </p>
                                                </div>
                                                <TrendingUp className="h-6 w-6 text-orange-600" />
                                            </div>
                                            <p className="text-xs mt-2">
                                                Costo Incremental: {safeNumberFormat((trazabilidadData.costo_incremental_ultima_cosecha || 0), { isCurrency: true })}
                                            </p>
                                            <p className="text-xs mt-1">
                                                Cantidad Última Cosecha: {safeNumberFormat((trazabilidadData.cantidad_incremental_ultima_cosecha || 0))}
                                            </p>
                                        </div>
                                    )}

                                    {trazabilidadData.precio_minimo_recuperar_inversion !== undefined && (
                                        <div
                                            className={`p-4 rounded-lg border ${trazabilidadData.precio_minimo_recuperar_inversion > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'} cursor-pointer hover:shadow-md transition`}
                                            onClick={() => handleCardClick('precioMinimoRecuperar')}
                                        >
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="text-sm font-medium text-gray-500">Precio Mínimo Venta/Unidad (Recuperar Inversión)</p>
                                                    <p className={`text-2xl font-bold mt-1 ${trazabilidadData.precio_minimo_recuperar_inversion > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                                        {safeNumberFormat((trazabilidadData.precio_minimo_recuperar_inversion || 0), { decimals: 4, isCurrency: true })}
                                                    </p>
                                                </div>
                                                <RefreshCcw className={`h-6 w-6 ${trazabilidadData.precio_minimo_recuperar_inversion > 0 ? 'text-red-600' : 'text-green-600'}`} />
                                            </div>
                                            <p className="text-xs mt-2">
                                                Stock disponible para cubrir: {safeNumberFormat((trazabilidadData.stock_disponible_total || 0))}
                                            </p>
                                        </div>
                                    )}
                                </div>

                                {seccionAbierta === 'historial' && (
                                    <div className="mb-6 border rounded-lg overflow-hidden">
                                        <div className="p-4 bg-gray-50 border-b">
                                            <h3 className="font-medium flex items-center gap-2">
                                                <History className="h-5 w-5 text-gray-600" />
                                                Historial de Snapshots
                                            </h3>
                                        </div>
                                        <div className="p-4">
                                            {ordenarSnapshots.length > 0 ? (
                                                <Tabla
                                                    title=""
                                                    headers={['Versión', 'Fecha', 'B/C', 'Balance', 'Acciones']}
                                                    data={datosParaTabla}
                                                    rowsPerPageOptions={[5, 10, 20]}
                                                />
                                            ) : (
                                                <p className="text-gray-500 text-center py-4">No hay historial disponible</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <div className="space-y-4">
                                    <SeccionDesplegable
                                        titulo="Actividades realizadas"
                                        icono={<Activity className="h-5 w-5 text-green-600" />}
                                        cantidad={trazabilidadData.detalle_actividades?.length || 0}
                                        abierta={seccionAbierta === 'actividades'}
                                        onToggle={() => onToggleSeccion('actividades')}
                                    >
                                        {trazabilidadData.detalle_actividades?.length > 0 ? (
                                            <Tabla
                                                title=""
                                                headers={['Actividad', 'Fecha', 'Responsable', 'Duración', 'Estado']}
                                                data={trazabilidadData.detalle_actividades.map((a) => ({
                                                    actividad: a.actividad || 'Sin nombre',
                                                    fecha: a.fecha_realizada || a.fecha_programada || 'Sin fecha',
                                                    responsable: a.responsable || 'No asignado',
                                                    duración: `${a.duracion_minutos ? Math.round(a.duracion_minutos) : '0'} min`,
                                                    estado: a.estado || 'Sin estado'
                                                }))}
                                                rowsPerPageOptions={[5, 10]}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No hay actividades registradas</p>
                                        )}
                                    </SeccionDesplegable>

                                    <SeccionDesplegable
                                        titulo="Insumos utilizados"
                                        icono={<Package className="h-5 w-5 text-blue-600" />}
                                        cantidad={trazabilidadData.detalle_insumos?.length || 0}
                                        abierta={seccionAbierta === 'insumos'}
                                        onToggle={() => onToggleSeccion('insumos')}
                                    >
                                        {trazabilidadData.detalle_insumos?.length > 0 ? (
                                            <Tabla
                                                title=""
                                                headers={['Insumo', 'Tipo', 'Cantidad', 'Costo']}
                                                data={trazabilidadData.detalle_insumos.map((i) => ({
                                                    insumo: i.nombre || 'Sin nombre',
                                                    tipo: i.tipo_insumo || 'Sin tipo',
                                                    cantidad: `${i.cantidad || '0'} ${i.unidad_medida || ''}`,
                                                    costo: safeNumberFormat((i.costo_total || 0), { isCurrency: true })
                                                }))}
                                                rowsPerPageOptions={[5, 10]}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No hay insumos registrados</p>
                                        )}
                                    </SeccionDesplegable>

                                    <SeccionDesplegable
                                        titulo="Ventas realizadas"
                                        icono={<DollarSign className="h-5 w-5 text-green-600" />}
                                        cantidad={trazabilidadData.detalle_ventas?.length || 0}
                                        abierta={seccionAbierta === 'ventas'}
                                        onToggle={() => onToggleSeccion('ventas')}
                                    >
                                        {trazabilidadData.detalle_ventas?.length > 0 ? (
                                            <Tabla
                                                title=""
                                                headers={['Fecha', 'Cantidad', 'Precio Unitario', 'Total']}
                                                data={trazabilidadData.detalle_ventas.map((v) => ({
                                                    fecha: v.fecha || 'Sin fecha',
                                                    cantidad: `${v.cantidad || '0'} ${v.unidad_medida || ''}`,
                                                    'precio_unitario': safeNumberFormat((v.precio_unidad_con_descuento || 0), { isCurrency: true }),
                                                    total: safeNumberFormat((v.total || 0), { isCurrency: true })
                                                }))}
                                                rowsPerPageOptions={[5, 10]}
                                            />
                                        ) : (
                                            <p className="text-gray-500 text-center py-4">No hay ventas registradas</p>
                                        )}
                                    </SeccionDesplegable>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
                        <p className="text-gray-500">No hay datos disponibles para esta plantación</p>
                    </div>
                )
            ) : (
                <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
                    <p className="text-gray-500">Seleccione una plantación para visualizar la trazabilidad</p>
                </div>
            )}
        </div>
    );
};

const SeccionDesplegable = ({
    titulo,
    icono,
    cantidad,
    abierta,
    onToggle,
    children
}: {
    titulo: string;
    icono: React.ReactNode;
    cantidad: number;
    abierta: boolean;
    onToggle: () => void;
    children: React.ReactNode;
}) => {
    return (
        <div className="border rounded-lg overflow-hidden">
            <button
                className="w-full flex justify-between items-center p-4 bg-gray-50 hover:bg-gray-100 transition"
                onClick={onToggle}
            >
                <div className="flex items-center gap-3">
                    {icono}
                    <h3 className="font-medium">{titulo}</h3>
                    <span className="text-sm text-gray-500 ml-2">({cantidad})</span>
                </div>
                {abierta ? <ChevronUp /> : <ChevronDown />}
            </button>

            {abierta && (
                <div className="p-4 border-t">
                    {children}
                </div>
            )}
        </div>
    );
};

export default ResumenTrazabilidad;