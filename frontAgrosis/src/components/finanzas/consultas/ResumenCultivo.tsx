import { BarChart2, DollarSign, Clock } from 'lucide-react';

interface ResumenCultivoProps {
    trazabilidadData: any;
    onBeneficioClick: () => void;
    onFinanzasClick: () => void;
    onTiempoClick: () => void;
}

// Función mejorada para formatear fechas
const formatFechaPlantacion = (fechaStr: string) => {
    if (!fechaStr) return 'Fecha no disponible';
    
    try {
        // Primero intentamos con el formato ISO
        let fecha = new Date(fechaStr);
        
        // Si es inválida, intentamos con formato YYYY-MM-DD
        if (isNaN(fecha.getTime())) {
            fecha = new Date(fechaStr.split('T')[0]);
        }
        
        // Si sigue siendo inválida, devolvemos el string original
        if (isNaN(fecha.getTime())) {
            return fechaStr;
        }
        
        const opciones: Intl.DateTimeFormatOptions = {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        };
        
        return fecha.toLocaleDateString('es-ES', opciones);
    } catch (error) {
        console.error('Error al formatear fecha:', error);
        return fechaStr;
    }
};

const ResumenCultivo = ({
    trazabilidadData,
    onBeneficioClick,
    onFinanzasClick,
    onTiempoClick
}: ResumenCultivoProps) => {
    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                    {trazabilidadData.cultivo} 
                    <span className="text-sm text-gray-500 ml-2">
                        (Plantado: {formatFechaPlantacion(trazabilidadData.fecha_plantacion)})
                    </span>
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    {/* Tarjeta de Beneficio/Costo */}
                    <div 
                        className={`p-4 rounded-lg border ${trazabilidadData.beneficio_costo >= 1 ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'} cursor-pointer hover:shadow-md transition`}
                        onClick={onBeneficioClick}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Relación B/C</p>
                                <p className="text-2xl font-bold mt-1">
                                    {trazabilidadData.beneficio_costo.toFixed(2)}
                                </p>
                            </div>
                            <BarChart2 className={`h-6 w-6 ${trazabilidadData.beneficio_costo >= 1 ? 'text-green-600' : 'text-red-600'}`} />
                        </div>
                        <p className="text-xs mt-2">
                            {trazabilidadData.beneficio_costo >= 1 ? 'Rentable' : 'No rentable'}
                        </p>
                    </div>
                    
                    {/* Tarjeta de Ingresos/Egresos */}
                    <div 
                        className="p-4 rounded-lg border border-blue-200 bg-blue-50 cursor-pointer hover:shadow-md transition"
                        onClick={onFinanzasClick}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Balance</p>
                                <p className={`text-2xl font-bold mt-1 ${trazabilidadData.ingresos_ventas - (trazabilidadData.costo_mano_obra + trazabilidadData.egresos_insumos) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    ${(trazabilidadData.ingresos_ventas - (trazabilidadData.costo_mano_obra + trazabilidadData.egresos_insumos)).toLocaleString()}
                                </p>
                            </div>
                            <DollarSign className="h-6 w-6 text-blue-600" />
                        </div>
                        <p className="text-xs mt-2">
                            Ingresos: ${trazabilidadData.ingresos_ventas.toLocaleString()}
                        </p>
                    </div>
                    
                    {/* Tarjeta de Tiempo */}
                    <div 
                        className="p-4 rounded-lg border border-purple-200 bg-purple-50 cursor-pointer hover:shadow-md transition"
                        onClick={onTiempoClick}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm font-medium text-gray-500">Tiempo invertido</p>
                                <p className="text-2xl font-bold mt-1 text-purple-600">
                                    {trazabilidadData.total_horas} hrs
                                </p>
                            </div>
                            <Clock className="h-6 w-6 text-purple-600" />
                        </div>
                        <p className="text-xs mt-2">
                            {trazabilidadData.jornales} jornales
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumenCultivo;