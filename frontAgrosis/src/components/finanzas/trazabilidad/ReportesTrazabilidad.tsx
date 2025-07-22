import { useState } from 'react';
import { TrazabilidadCultivoReporte, SnapshotTrazabilidad } from './Types';
import { Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import ReporteRentabilidad from './ReporteRentabilidad';
import ReporteInsumos from './ReporteInsumos';
import ReporteProduccionVentas from './ReporteProduccionVentas';
import ReporteHistorial from './ReporteHistorial';
import ReporteComparaciones from './ReporteComparaciones';
import ReporteMultiplesCultivos from './ReporteMultiplesCultivos';
import ReporteEficienciaOperativa from './ReporteEficienciaOperativa';

interface ReportesTrazabilidadProps {
    plantacionSeleccionada: number | null;
    trazabilidadData: TrazabilidadCultivoReporte | undefined;
    plantaciones: Plantacion[] | undefined;
    ordenarSnapshots: SnapshotTrazabilidad[];
    comparando: number[];
    onVolver: () => void; // ✅ Prop agregada
}

const ReportesTrazabilidad = ({
    plantacionSeleccionada,
    trazabilidadData,
    plantaciones,
    ordenarSnapshots,
    comparando,
    onVolver, // ✅ Recibe prop
}: ReportesTrazabilidadProps) => {
    const [tipoReporte, setTipoReporte] = useState<
        'rentabilidad' | 'insumos' | 'produccion_ventas' | 'historial' | 'comparaciones' | 'multiples' | 'eficiencia'
    >('rentabilidad');
    const [formato, setFormato] = useState<'pdf' | 'excel'>('pdf');

    const renderReporte = () => {
        switch (tipoReporte) {
            case 'rentabilidad':
                return <ReporteRentabilidad trazabilidadData={trazabilidadData} formato={formato} />;
            case 'insumos':
                return <ReporteInsumos trazabilidadData={trazabilidadData} formato={formato} />;
            case 'produccion_ventas':
                return <ReporteProduccionVentas trazabilidadData={trazabilidadData} formato={formato} />;
            case 'historial':
                return <ReporteHistorial ordenarSnapshots={ordenarSnapshots} formato={formato} />;
            case 'comparaciones':
                return <ReporteComparaciones ordenarSnapshots={ordenarSnapshots} comparando={comparando} formato={formato} />;
            case 'multiples':
                return (
                    <ReporteMultiplesCultivos
                        plantaciones={plantaciones}
                        plantacionSeleccionada={plantacionSeleccionada}
                        formato={formato}
                    />
                );
            case 'eficiencia':
                return <ReporteEficienciaOperativa trazabilidadData={trazabilidadData} formato={formato} />;
            default:
                return null;
        }
    };

    return (
        <div className="w-full lg:w-3/4 bg-white rounded-xl shadow-md p-6">
            {/* Botón de volver */}
            <button
                onClick={onVolver}
                className="mb-4 text-green-700 hover:underline flex items-center gap-1"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                </svg>
                Volver
            </button>

            <h1 className="text-2xl font-bold text-green-800 mb-6">Generar Reportes</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Reporte</label>
                    <select
                        value={tipoReporte}
                        onChange={(e) => setTipoReporte(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-gray-50"
                    >
                        <option value="rentabilidad">Rentabilidad</option>
                        <option value="insumos">Uso de Insumos</option>
                        <option value="produccion_ventas">Producción y Ventas</option>
                        <option value="historial">Historial de Snapshots</option>
                        <option value="comparaciones" disabled={comparando.length < 2}>Comparaciones</option>
                        <option value="multiples">Múltiples Cultivos</option>
                        <option value="eficiencia">Eficiencia Operativa</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Formato</label>
                    <select
                        value={formato}
                        onChange={(e) => setFormato(e.target.value as any)}
                        className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-green-500 focus:border-green-500 transition bg-gray-50"
                    >
                        <option value="pdf">PDF</option>
                        <option value="excel">Excel</option>
                    </select>
                </div>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-inner">{renderReporte()}</div>
        </div>
    );
};

export default ReportesTrazabilidad;
