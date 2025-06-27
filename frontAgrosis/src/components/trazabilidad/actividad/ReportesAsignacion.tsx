import { useMemo, useEffect } from 'react';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';
import { showToast } from '@/components/globales/Toast';

// Definición de tipos basada en el hook
interface ReporteAsignacion {
  fecha_programada: string;
  plantacion: string;
  usuario: string;
  actividad: string;
  estado: string;
  observaciones: string;
}

// Definición de la interfaz de props para el componente
interface ReporteAsignacionProps {
  data: ReporteAsignacion[] | undefined;
  loading: boolean;
  error: Error | null;
}

const ReporteAsignacion = ({ data: asignaciones, loading: isLoading, error: isError }: ReporteAsignacionProps) => {
  useEffect(() => {
    if (isLoading) {
      showToast({
        title: 'Cargando reporte',
        description: 'Cargando el reporte de asignaciones, por favor espera...',
        timeout: 3000,
        variant: 'info',
      });
    }
    if (isError) {
      showToast({
        title: 'Error al cargar reporte',
        description: `No se pudo cargar el reporte: ${isError?.message || 'Desconocido'}`,
        timeout: 5000,
        variant: 'error',
      });
    }
  }, [isLoading, isError]);

  const asignacionesList = useMemo(() => {
    // Manejar caso de datos undefined o vacíos
    return asignaciones || [];
  }, [asignaciones]);

  const columnasPDF = ['Fecha Programada', 'Plantación', 'Usuario', 'Actividad', 'Estado', 'Observaciones'];
  const datosPDF = useMemo(() => {
    if (asignacionesList.length === 0) {
      return [['No hay datos disponibles', '', '', '', '', '']];
    }
    return asignacionesList.map((asignacion: ReporteAsignacion) => [
      asignacion.fecha_programada || 'Sin fecha',
      asignacion.plantacion || 'Sin plantación',
      asignacion.usuario || 'Sin usuario',
      asignacion.actividad || 'Sin actividad',
      asignacion.estado || 'Sin estado',
      asignacion.observaciones || 'Sin observaciones',
    ]);
  }, [asignacionesList]);

  if (isLoading) {
    return <div className="text-center text-gray-500 p-4">Cargando reporte...</div>;
  }

  if (isError || !asignaciones) {
    return <div className="text-center text-red-500 p-4">Error al cargar el reporte. Intenta de nuevo.</div>;
  }

  return (
    <div className="p-4">
      <Tabla
        title="Reporte de Asignaciones"
        headers={columnasPDF}
        data={asignacionesList.map((asignacion: ReporteAsignacion, index) => ({
          id: index,
          fecha_programada: asignacion.fecha_programada || 'Sin fecha',
          plantacion: asignacion.plantacion || 'Sin plantación',
          usuario: asignacion.usuario || 'Sin usuario',
          actividad: asignacion.actividad || 'Sin actividad',
          estado: asignacion.estado || 'Sin estado',
          observaciones: asignacion.observaciones || 'Sin observaciones',
        }))}
        onCreate={() => {}}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_asignaciones.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Asignaciones"
          />
        }
      />
      {asignacionesList.length === 0 ? (
        <div className="text-center text-red-500 mt-4">No se encontraron resultados.</div>
      ) : null}
      <div className="mt-4 text-sm text-gray-500 text-center">
        Total de asignaciones: {asignacionesList.length}
      </div>
    </div>
  );
};

export default ReporteAsignacion;