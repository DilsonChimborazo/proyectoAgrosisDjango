import { useState, useMemo } from 'react';
import { useTrazabilidadActual, useResumenActual, useHistorialTrazabilidad } from '@/hooks/finanzas/consultas/useTrazabilidadHistorica';
import PlantacionSelector from './PlantacionSelector';
import ResumenTrazabilidad from './ResumenTrazabilidad';
import ModalesTrazabilidad from './ModalesTrazabilidad';
import { usePlantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { SnapshotTrazabilidad} from './Types';

const TrazabilidadHistorica = () => {
    const [plantacionSeleccionada, setPlantacionSeleccionada] = useState<number | null>(null);
    const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);
    const [modalAbierto, setModalAbierto] = useState<{tipo: string, data: any} | null>(null);
    const [comparando, setComparando] = useState<number[]>([]);

    const { data: plantaciones, isLoading: loadingPlantaciones } = usePlantacion();
    const { data: trazabilidadData, isLoading } = useTrazabilidadActual(plantacionSeleccionada || 0);
    const { data: resumenActual } = useResumenActual(plantacionSeleccionada || 0);
    const { data: historial } = useHistorialTrazabilidad(plantacionSeleccionada || 0);

    const ordenarSnapshots = useMemo(() => {
        if (!historial) return [];
        return [...historial].sort((a: SnapshotTrazabilidad, b: SnapshotTrazabilidad) => {
            return new Date(a.fecha_registro).getTime() - new Date(b.fecha_registro).getTime();
        });
    }, [historial]);

    const handlePlantacionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setPlantacionSeleccionada(Number(e.target.value));
        setSeccionAbierta(null);
        setComparando([]);
    };

    const toggleSeccion = (seccion: string) => {
        setSeccionAbierta(seccionAbierta === seccion ? null : seccion);
    };

    const abrirModal = (tipo: string, data: any) => {
        setModalAbierto({ tipo, data });
    };

    const cerrarModal = () => {
        setModalAbierto(null);
    };

    const toggleCompararVersion = (versionId: number) => {
        setComparando(prev => 
            prev.includes(versionId) 
                ? prev.filter(id => id !== versionId) 
                : [...prev, versionId]
        );
    };

    return (
        <div className="flex flex-col lg:flex-row p-4 gap-6 min-h-screen">
            <PlantacionSelector 
                plantaciones={plantaciones}
                loadingPlantaciones={loadingPlantaciones}
                plantacionSeleccionada={plantacionSeleccionada}
                onPlantacionChange={handlePlantacionChange}
                onVerResumen={() => abrirModal('resumen', resumenActual || trazabilidadData)}
                onVerEvolucion={() => abrirModal('evolucion', ordenarSnapshots)}
                onCompararVersiones={() => abrirModal('comparar', ordenarSnapshots)}
                onExportarReporte={() => abrirModal('exportar', trazabilidadData)}
                historialDisponible={!!ordenarSnapshots && ordenarSnapshots.length >= 2}
            />
            
            <ResumenTrazabilidad 
                plantacionSeleccionada={plantacionSeleccionada}
                isLoading={isLoading}
                trazabilidadData={trazabilidadData}
                seccionAbierta={seccionAbierta}
                ordenarSnapshots={ordenarSnapshots}
                comparando={comparando}
                onToggleSeccion={toggleSeccion}
                onAbrirModal={abrirModal}
                onToggleComparar={toggleCompararVersion}
            />
            
            <ModalesTrazabilidad 
                modalAbierto={modalAbierto}
                comparando={comparando}
                onCerrarModal={cerrarModal}
            />
        </div>
    );
};

export default TrazabilidadHistorica;

