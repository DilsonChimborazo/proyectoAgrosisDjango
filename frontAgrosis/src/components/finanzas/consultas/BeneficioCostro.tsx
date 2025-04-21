import { useState } from 'react';
import { useTrazabilidadCultivo } from '@/hooks/finanzas/consultas/useBeneficioCosto';
import { useCultivo } from '@/hooks/trazabilidad/cultivo/useCultivo';
import VentanaModal from "../../globales/VentanasModales";

import CultivoSelector from './CultivoSelector';
import ResumenCultivo from './ResumenCultivo';
import SeccionActividades from './SeccionActividades';
import SeccionInsumos from './SeccionInsumos';
import SeccionVentas from './SeccionVentas';
import { renderModalContent } from './ModalsContent';

const BeneficioCosto = () => {
    const [cultivoSeleccionado, setCultivoSeleccionado] = useState<number | null>(null);
    const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null);
    const [modalAbierto, setModalAbierto] = useState<{ tipo: string, data: any } | null>(null);

    const { data: cultivos, isLoading: loadingCultivos } = useCultivo();
    const { data: trazabilidadData, isLoading } = useTrazabilidadCultivo(cultivoSeleccionado || 0);

    const handleCultivoChange = (cultivoId: number) => {
        setCultivoSeleccionado(cultivoId);
        setSeccionAbierta(null);
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

    return (
        <div className="flex flex-col lg:flex-row p-4 gap-6 min-h-screen">
            {/* Panel izquierdo - Selector de cultivo */}
            <CultivoSelector
                cultivos={cultivos || []} 
                loadingCultivos={loadingCultivos}
                cultivoSeleccionado={cultivoSeleccionado}
                onCultivoChange={handleCultivoChange}
                onVerResumen={() => abrirModal('resumen', trazabilidadData)}
                onVerGraficos={() => abrirModal('graficos', trazabilidadData)}
            />

            {/* Panel derecho - Contenido principal */}
            <div className="w-full lg:w-3/4 space-y-4 max-h-[80vh] overflow-y-auto scrollbar-hide">
                {cultivoSeleccionado ? (
                    isLoading ? (
                        <div className="bg-white rounded-xl shadow-md p-6 h-64 flex items-center justify-center">
                            <div className="animate-pulse text-center">
                                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4 mx-auto"></div>
                                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                            </div>
                        </div>
                    ) : trazabilidadData ? (
                        <>
                            <ResumenCultivo
                                trazabilidadData={trazabilidadData}
                                onBeneficioClick={() => abrirModal('beneficio', trazabilidadData)}
                                onFinanzasClick={() => abrirModal('finanzas', trazabilidadData)}
                                onTiempoClick={() => abrirModal('tiempo', trazabilidadData)}
                            />

                            <div className="bg-white border rounded-lg overflow-hidden space-y-4 p-6">
                                <SeccionActividades
                                    actividades={trazabilidadData.detalle_actividades}
                                    isOpen={seccionAbierta === 'actividades'}
                                    onToggle={() => toggleSeccion('actividades')}
                                    onRowClick={(row) => abrirModal('actividad', row)}
                                />

                                <SeccionInsumos
                                    insumos={trazabilidadData.detalle_insumos}
                                    isOpen={seccionAbierta === 'insumos'}
                                    onToggle={() => toggleSeccion('insumos')}
                                    onRowClick={(row) => abrirModal('insumo', row)}
                                />

                                <SeccionVentas
                                    ventas={trazabilidadData.detalle_ventas}
                                    isOpen={seccionAbierta === 'ventas'}
                                    onToggle={() => toggleSeccion('ventas')}
                                    onRowClick={(row) => abrirModal('venta', row)}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
                            <p className="text-gray-500">No hay datos disponibles para este cultivo</p>
                        </div>
                    )
                ) : (
                    <div className="bg-white rounded-xl shadow-md p-6 flex items-center justify-center h-64">
                        <p className="text-gray-500">Seleccione un cultivo para visualizar el análisis</p>
                    </div>
                )}
            </div>

            {/* Modales */}
            {modalAbierto && (
                <VentanaModal
                    isOpen={true}
                    onClose={cerrarModal}
                    titulo={`Detalle de ${modalAbierto.tipo}`}
                    variant="content"
                >
                    {renderModalContent(modalAbierto.tipo, modalAbierto.data)}
                </VentanaModal>
            )}
        </div>
    );
};

export default BeneficioCosto;