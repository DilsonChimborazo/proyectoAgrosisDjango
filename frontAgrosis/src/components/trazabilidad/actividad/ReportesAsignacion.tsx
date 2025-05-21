import { useMemo, useEffect } from 'react';
import { useReporteAsignaciones } from '@/hooks/trazabilidad/asignacion/useReportesAsignacion';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';
import { showToast } from '@/components/globales/Toast';

const ReporteAsignacion = () => {
  const { data: asignaciones, isLoading, isError } = useReporteAsignaciones();

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
        description: 'No se pudo cargar el reporte de asignaciones',
        timeout: 5000,
        variant: 'error',
      });
    }
  }, [isLoading, isError]);

  const asignacionesList = useMemo(() => {
    return Array.isArray(asignaciones) ? asignaciones : [];
  }, [asignaciones]);

  const columnasPDF = ['Fecha Programada', 'Plantacion', 'Usuario', 'Actividad', 'Estado', 'Observaciones'];
  const datosPDF = useMemo(() => {
    return asignacionesList.map(asignacion => [
      asignacion.fecha_programada || 'Sin fecha',
      asignacion.plantacion || 'Sin plantación',
      asignacion.usuario || 'Sin usuario',
      asignacion.actividad || 'Sin actividad',
      asignacion.estado || 'Sin estado',
      asignacion.observaciones || 'Sin observaciones'
    ]);
  }, [asignacionesList]);

  return (
    <div className="p-4">
      <Tabla
        title="Reporte de Asignaciones"
        headers={columnasPDF}
        data={asignacionesList.map((asignacion, index) => ({
          id: index,
          fecha_programada: asignacion.fecha_programada || 'Sin fecha',
          plantacion: asignacion.plantacion || 'Sin plantación',
          usuario: asignacion.usuario || 'Sin usuario',
          actividad: asignacion.actividad || 'Sin actividad',
          estado: asignacion.estado || 'Sin estado',
          observaciones: asignacion.observaciones || 'Sin observaciones'
        }))}
        onClickAction={(row) => console.log('Detalle:', row)}
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
      <div className="mt-4 text-sm text-gray-500">
        Total de asignaciones: {asignacionesList.length}
      </div>
    </div>
  );
};

export default ReporteAsignacion;