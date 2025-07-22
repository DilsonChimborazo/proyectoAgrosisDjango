import React, { useState } from 'react';
import ResumenPagosUsuario from './ResumenPagosUsuario';
import ResumenPagosActividad from './ResumenPagosActividad';
import TablaPagosDetallados from './TablaPagosDetallados';
import VentanaModal from '../../globales/VentanasModales';
import Button from '../../globales/Button';

const PagosPage: React.FC = () => {
  const [modalUsuarioAbierto, setModalUsuarioAbierto] = useState(false);
  const [modalActividadAbierto, setModalActividadAbierto] = useState(false);

  return (
    <div className="w-full min-h-screen p-2 sm:p-4 md:p-6 lg:p-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
        {/* Resumen por Usuario */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">
              Resumen por Usuario
            </h2>
            <Button
              onClick={() => setModalUsuarioAbierto(true)}
              className="bg-green-600 text-white hover:bg-blue-700 w-full sm:w-auto text-center"
              text="Ver gráfico"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Haz clic en "Ver gráfico" para visualizar el detalle de pagos por usuario.
          </p>
        </div>

        {/* Resumen por Actividad */}
        <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-0">
              Resumen por Actividad
            </h2>
            <Button
              onClick={() => setModalActividadAbierto(true)}
              className="bg-green-600 text-white hover:bg-blue-700 w-full sm:w-auto text-center"
              text="Ver gráfico"
            />
          </div>
          <p className="text-sm sm:text-base text-gray-600">
            Haz clic en "Ver gráfico" para visualizar el detalle de pagos por actividad.
          </p>
        </div>
      </div>

      {/* Tabla de pagos detallados */}
      <div className="w-full overflow-x-auto">
        <TablaPagosDetallados />
      </div>

      {/* Modal Usuario */}
      <VentanaModal
        isOpen={modalUsuarioAbierto}
        onClose={() => setModalUsuarioAbierto(false)}
        titulo="Resumen de Pagos por Usuario"
        size="lg"
      >
        <div className="h-[50vh] sm:h-[60vh] w-full p-2 sm:p-4 overflow-y-auto">
          <ResumenPagosUsuario esModal />
        </div>
      </VentanaModal>

      {/* Modal Actividad */}
      <VentanaModal
        isOpen={modalActividadAbierto}
        onClose={() => setModalActividadAbierto(false)}
        titulo="Resumen de Pagos por Actividad"
        size="lg"
      >
        <div className="h-[50vh] sm:h-[60vh] w-full p-2 sm:p-4 overflow-y-auto">
          <ResumenPagosActividad esModal />
        </div>
      </VentanaModal>
    </div>
  );
};

export default PagosPage;
