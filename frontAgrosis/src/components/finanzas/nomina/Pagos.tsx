import React, { useState } from 'react';
import ResumenPagosUsuario from "./ResumenPagosUsuario";
import ResumenPagosActividad from "./ResumenPagosActividad";
import TablaPagosDetallados from "./TablaPagosDetallados";
import VentanaModal from '../../globales/VentanasModales';
import Button from '../../globales/Button';

const PagosPage: React.FC = () => {
    const [modalAbierto, setModalAbierto] = useState<{
        tipo: 'usuario' | 'actividad' | null;
    }>({ tipo: null });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Resumen por Usuario</h2>
                        <Button
                            onClick={() => setModalAbierto({ tipo: 'usuario' })}
                            className="bg-green-600 text-white hover:bg-blue-700" text={'Ver gráfico'}
                        >
                            Ver gráfico
                        </Button>
                    </div>
                    <div className="text-gray-600">
                        <p>Haz clic en "Ver gráfico" para visualizar el detalle de pagos por usuario.</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Resumen por Actividad</h2>
                        <Button
                            onClick={() => setModalAbierto({ tipo: 'actividad' })}
                            className="bg-green-600 text-white hover:bg-blue-700" text={'Ver gráfico'}
                        >
                            Ver gráfico
                        </Button>
                    </div>
                    <div className="text-gray-600">
                        <p>Haz clic en "Ver gráfico" para visualizar el detalle de pagos por actividad.</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
                <TablaPagosDetallados />
            </div>

            <VentanaModal
                isOpen={modalAbierto.tipo === 'usuario'}
                onClose={() => setModalAbierto({ tipo: null })}
                titulo="Resumen de Pagos por Usuario"
                size="lg"
            >
                <div className="h-[60vh] w-full p-4 overflow-y-auto">
                    <ResumenPagosUsuario esModal />
                </div>
            </VentanaModal>

            <VentanaModal
                isOpen={modalAbierto.tipo === 'actividad'}
                onClose={() => setModalAbierto({ tipo: null })}
                titulo="Resumen de Pagos por Actividad"
                size="lg"
            >
                <div className="h-[60vh] w-full p-4 overflow-y-auto">
                    <ResumenPagosActividad esModal />
                </div>
            </VentanaModal>
        </div>
    );
};

export default PagosPage;