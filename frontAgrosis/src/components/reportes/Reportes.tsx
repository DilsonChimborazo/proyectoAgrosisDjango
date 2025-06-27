import { useState } from 'react';

import useLotesActivos from '@/hooks/iot/lote/useLotesActivos';
import { useReporteHerramientas } from '@/hooks/inventario/herramientas/useReporteHerramientas';
import { useReporteInsumos } from '@/hooks/inventario/insumos/useReporteInsumos';
import { useReporteControles } from '@/hooks/trazabilidad/control/useReporteControl';
import { useReporteAsignaciones } from '@/hooks/trazabilidad/asignacion/useReportesAsignacion';
import ReporteHerramientas from '@/components/inventario/herramientas/ReporteHerramientas';
import Tabla from '@/components/globales/Tabla';
import ReporteInsumosBajoStock from '../inventario/insumos/ReporteInsumo';
import ReportesControl from '@/components/trazabilidad/control/ReportesControl';
import ReporteAsignacion from '@/components/trazabilidad/actividad/ReportesAsignacion';
import { useReporteResiduos } from '@/hooks/trazabilidad/residuo/useReporteResiduos';
import ReporteResiduos from '../trazabilidad/residuos/ReporteResiduo';

type Modulo = {
  id: string;
  nombre: string;
  reportes: Reporte[];
};

type Reporte = {
  id: string;
  nombre: string;
  requiereFechas: boolean;
  componente: React.ReactNode;
};

const Reportes = () => {
  // Estados para selección
  const [moduloSeleccionado, setModuloSeleccionado] = useState<string>('');
  const [reporteSeleccionado, setReporteSeleccionado] = useState<string>('');
  
  // Estados para fechas
  const [fechaInicio, setFechaInicio] = useState<string>(
    new Date(new Date().setDate(1)).toISOString().split('T')[0]
  );
  const [fechaFin, setFechaFin] = useState<string>(
    new Date().toISOString().split('T')[0]
  );

  // Obtener datos de los hooks

  const { lotes, loading: loadingLotes, error: errorLotes } = useLotesActivos();
  const { data: herramientas, isLoading: loadingHerramientas, error: errorHerramientas } = useReporteHerramientas();
  const { data: insumosBajoStock, isLoading: loadingInsumos, error: errorInsumos } = useReporteInsumos();
  const { data: controles, isLoading: loadingControles, error: errorControles } = useReporteControles();
  const { data: asignaciones, isLoading: loadingAsignaciones, error: errorAsignaciones } = useReporteAsignaciones();
  const { data: residuos, isLoading: loadingResiduos, isError: errorResiduos } = useReporteResiduos();
  
  // Configuración de módulos y reportes disponibles
  const modulos: Modulo[] = [
    {
      id: 'iot',
      nombre: 'IoT',
      reportes: [
        {
          id: 'lotes-activos',
          nombre: 'Lotes Activos',
          requiereFechas: false,
          componente: <ReporteLotes data={lotes} loading={loadingLotes} error={errorLotes} />
        }
      ]
    },
    {
      id: 'trazabilidad',
      nombre: 'Trazabilidad',
      reportes: [
        {
          id: 'controles-fitosanitarios',
          nombre: 'Controles Fitosanitarios',
          requiereFechas: false,
          componente: <ReportesControl 
                        data={controles} 
                        loading={loadingControles} 
                        error={errorControles} 
                      />
        },
        {
          id: 'asignaciones',
          nombre: 'Reporte de Asignaciones',
          requiereFechas: false,
          componente: <ReporteAsignacion 
                        data={asignaciones} 
                        loading={loadingAsignaciones} 
                        error={errorAsignaciones} 
                      />
        },
        {
          id: 'residuos',
          nombre: 'Reporte Residuos',
          requiereFechas: false,
          componente: <ReporteResiduos 
                        data={residuos} 
                        loading={loadingResiduos} 
                        error={errorResiduos} 
                      />
        }
      ]
    },
    {
      id: 'inventario',
      nombre: 'Inventario',
      reportes: [
        {
          id: 'herramientas',
          nombre: 'Reporte de Herramientas',
          requiereFechas: false,
          componente: <ReporteHerramientas 
                        data={herramientas} 
                        loading={loadingHerramientas} 
                        error={errorHerramientas} 
                      />
        },
        {
          id: 'insumos',
          nombre: 'Reporte de Insumos Bajo Stock',
          requiereFechas: false,
          componente: <ReporteInsumosBajoStock
                        data={insumosBajoStock}
                        loading={loadingInsumos}
                        error={errorInsumos}
                      />
        }
      ]
    }
  ];

  // Obtener el módulo y reporte actual seleccionado
  const moduloActual = modulos.find(m => m.id === moduloSeleccionado);
  const reporteActual = moduloActual?.reportes.find(r => r.id === reporteSeleccionado);

  // Manejar cambio de módulo
  const handleModuloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setModuloSeleccionado(e.target.value);
    setReporteSeleccionado('');
  };

  // Manejar cambio de reporte
  const handleReporteChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setReporteSeleccionado(e.target.value);
  };

  return (
    <div className="flex p-4 gap-6">
      {/* Panel izquierdo (1/4) - Selectores */}
      <div className="w-1/4 bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center text-green-700 mb-8">Sistema de Reportes</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="modulo" className="block text-sm font-medium text-gray-700 mb-2">
              Módulo
            </label>
            <select
              id="modulo"
              value={moduloSeleccionado}
              onChange={handleModuloChange}
              className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
            >
              <option value="">Seleccione un módulo</option>
              {modulos.map((modulo) => (
                <option key={modulo.id} value={modulo.id}>
                  {modulo.nombre}
                </option>
              ))}
            </select>
          </div>
  
          {moduloSeleccionado && (
            <div>
              <label htmlFor="reporte" className="block text-sm font-medium text-gray-700 mb-2">
                Reporte
              </label>
              <select
                id="reporte"
                value={reporteSeleccionado}
                onChange={handleReporteChange}
                className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                disabled={!moduloSeleccionado}
              >
                <option value="">Seleccione un reporte</option>
                {moduloActual?.reportes.map((reporte) => (
                  <option key={reporte.id} value={reporte.id}>
                    {reporte.nombre}
                  </option>
                ))}
              </select>
            </div>
          )}
  
          {reporteActual?.requiereFechas && (
            <div className="pt-4">
              <h2 className="text-xl font-semibold mb-4">Filtrar por fecha</h2>
              <div className="space-y-4">
                <div>
                  <label htmlFor="fechaInicio" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => setFechaInicio(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <div>
                  <label htmlFor="fechaFin" className="block text-sm font-medium text-gray-700 mb-2">
                    Fecha de fin
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => setFechaFin(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500"
                    min={fechaInicio}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
  
      {/* Panel derecho (3/4) - Contenido del reporte */}
      <div className="w-3/4">
        {reporteSeleccionado ? (
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            {reporteActual?.componente}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-6 h-full flex items-center justify-center">
            <p className="text-gray-500">Seleccione un reporte para visualizar</p>
          </div>
        )}
      </div>
    </div>
  );
};


const ReporteLotes = ({ data, loading, error }: { data: any, loading: boolean, error: any }) => {
  const formatUbicacion = (ubicacion: any) => {
    if (!ubicacion) return 'No disponible';
    return `Lat: ${ubicacion.latitud}, Long: ${ubicacion.longitud}`;
  };

  const lotesData = data?.map((lote: any) => ({
    ...lote,
    fk_id_ubicacion: formatUbicacion(lote.fk_id_ubicacion)
  })) || [];

  const columns = [
    { name: 'Nombre', key: 'nombre_lote' },
    { name: 'Dimensión', key: 'dimencion' },
    { name: 'Estado', key: 'estado' },
    { name: 'Ubicación', key: 'fk_id_ubicacion' }
  ];

  return (
    <>
      <h2 className="text-xl font-semibold mb-4">Lotes Activos</h2>
      {loading ? (
        <p>Cargando lotes...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : (
        <Tabla
          title="Lotes Activos"
          headers={columns.map(c => c.name)}
          data={lotesData}
          onClickAction={(row) => console.log('Detalle:', row)}
          onUpdate={(row) => console.log('Actualizar:', row)}
          onCreate={() => console.log('Crear nuevo')}
        />
      )}
    </>
  );
};

export default Reportes;