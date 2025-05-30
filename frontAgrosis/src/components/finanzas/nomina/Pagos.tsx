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

    // Los estados y handlers de fecha han sido eliminados

    return (
        <div className="container mx-auto px-4 py-8">

            {/* Resúmenes Gráficos (Ahora antes de la tabla) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8"> {/* Añadido mb-8 para espacio debajo */}
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

            {/* La sección de Filtros de Fecha ha sido eliminada */}

            {/* Tabla de Pagos Detallados (ya no recibe props de fecha) */}
            <div className="grid grid-cols-1 gap-6"> {/* Eliminado mb-8 si ya no es necesario */}
                <TablaPagosDetallados />
            </div>

            {/* Modales (mantienen la configuración de tamaño que tenías) */}
            <VentanaModal
                isOpen={modalAbierto.tipo === 'usuario'}
                onClose={() => setModalAbierto({ tipo: null })}
                titulo="Resumen de Pagos por Usuario"
                size="lg" // Mantenido de tu último código
            >
                <div className="h-[60vh] w-full p-4 overflow-y-auto"> {/* Mantenido de tu último código */}
                    <ResumenPagosUsuario esModal />
                </div>
            </VentanaModal>

            <VentanaModal
                isOpen={modalAbierto.tipo === 'actividad'}
                onClose={() => setModalAbierto({ tipo: null })}
                titulo="Resumen de Pagos por Actividad"
                size="lg" // Mantenido de tu último código
            >
                <div className="h-[60vh] w-full p-4 overflow-y-auto"> {/* Mantenido de tu último código */}
                    <ResumenPagosActividad esModal />
                </div>
            </VentanaModal>
        </div>
    );
};

export default PagosPage;