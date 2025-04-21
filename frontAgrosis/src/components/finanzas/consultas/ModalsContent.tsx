import { TrazabilidadCultivoReporte } from '@/hooks/finanzas/consultas/useBeneficioCosto';

export const renderModalContent = (tipo: string, data: TrazabilidadCultivoReporte) => {
    switch(tipo) {
        case 'resumen':
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Fecha de plantación</p>
                            <p className="font-medium">{data.fecha_plantacion}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Especie</p>
                            <p className="font-medium">{data.especie || 'No especificado'}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Tiempo total invertido</p>
                            <p className="font-medium">{data.total_horas} horas ({data.jornales} jornales)</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-sm text-gray-500">Costo mano de obra</p>
                            <p className="font-medium">${data.costo_mano_obra.toLocaleString()}</p>
                        </div>
                    </div>
                    
                    <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                        <h4 className="font-semibold text-green-800 mb-2">Resumen financiero</h4>
                        <div className="space-y-2">
                            <div className="flex justify-between">
                                <span>Ingresos por ventas:</span>
                                <span className="font-medium">${data.ingresos_ventas.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Egresos por insumos:</span>
                                <span className="font-medium">${data.egresos_insumos.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Costo mano de obra:</span>
                                <span className="font-medium">${data.costo_mano_obra.toLocaleString()}</span>
                            </div>
                            <div className="border-t border-green-200 my-2"></div>
                            <div className="flex justify-between font-semibold">
                                <span>Balance total:</span>
                                <span className={data.resumen.balance >= 0 ? 'text-green-600' : 'text-red-600'}>
                                    ${data.resumen.balance.toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            );
            
        case 'beneficio':
            return (
                <div className="space-y-4">
                    <div className="bg-gray-50 p-6 rounded-lg text-center">
                        <p className="text-sm text-gray-500">Relación Beneficio/Costo</p>
                        <p className={`text-4xl font-bold my-3 ${data.beneficio_costo >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.beneficio_costo.toFixed(2)}
                        </p>
                        <p className={`text-lg ${data.beneficio_costo >= 1 ? 'text-green-600' : 'text-red-600'}`}>
                            {data.beneficio_costo >= 1 ? 'Rentable' : 'No rentable'}
                        </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>Una relación B/C mayor a 1 indica que el cultivo es rentable.</p>
                        <p>Valores menores a 1 indican que los costos superan los beneficios.</p>
                    </div>
                </div>
            );
            
        case 'finanzas':
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <p className="text-sm text-gray-500">Ingresos totales</p>
                            <p className="text-2xl font-medium text-blue-600">
                                ${data.ingresos_ventas.toLocaleString()}
                            </p>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                            <p className="text-sm text-gray-500">Egresos totales</p>
                            <p className="text-2xl font-medium text-red-600">
                                ${(data.costo_mano_obra + data.egresos_insumos).toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className={`p-4 rounded-lg border ${data.resumen.balance >= 0 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                        <p className="text-sm text-gray-500">Balance final</p>
                        <p className={`text-3xl font-bold ${data.resumen.balance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            ${data.resumen.balance.toLocaleString()}
                        </p>
                    </div>
                </div>
            );
            
        case 'tiempo':
            return (
                <div className="space-y-4">
                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200 text-center">
                        <p className="text-sm text-gray-500">Tiempo total invertido</p>
                        <p className="text-4xl font-bold text-purple-600 my-3">
                            {data.total_horas} horas
                        </p>
                        <p className="text-lg text-purple-600">
                            Equivalente a {data.jornales} jornales
                        </p>
                    </div>
                    <div className="mt-4 text-sm text-gray-600">
                        <p>Considerando que un jornal equivale a 8 horas de trabajo.</p>
                        <p>Total minutos: {data.total_tiempo_minutos}</p>
                    </div>
                </div>
            );
            
        // ... (otros casos)
            
        default:
            return <p>Información detallada no disponible</p>;
    }
};