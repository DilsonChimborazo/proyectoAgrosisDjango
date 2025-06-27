import { useMemo, useEffect } from 'react';
import { useReporteAsignaciones } from '@/hooks/trazabilidad/asignacion/useReportesAsignacion';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';
import { showToast } from '@/components/globales/Toast';

// Definición de tipos basados en la respuesta del backend
interface Usuario {
  nombre: string;
}

interface Asignacion {
  fecha_programada: string;
  plantacion: string;
  usuarios: Usuario[];
  actividad: string;
  estado: string;
  observaciones: string;
}

const ReporteAsignacion = () => {
  const { data: asignaciones, isLoading, isError, error } = useReporteAsignaciones() as {
    data: Asignacion[] | { reporte: Asignacion[] } | undefined;
    isLoading: boolean;
    isError: boolean;
    error?: any;
  };

  useEffect(() => {
    if (isLoading) {
      showToast({
        title: 'Cargando reporte',
        description: 'Cargando el reporte de asignaciones, por favor espera...',
        timeout: 3000,
        variant: 'info',
      });
    }
    if (isError && error) {
      showToast({
        title: 'Error al cargar reporte',
        description: `No se pudo cargar el reporte: ${error.message || 'Desconocido'}`,
        timeout: 5000,
        variant: 'error',
      });
    }
  }, [isLoading, isError, error]);

  const asignacionesList = useMemo(() => {
    // Manejar ambas estructuras posibles: array directo o objeto con "reporte"
    if (Array.isArray(asignaciones)) {
      return asignaciones;
    }
    if (asignaciones?.reporte && Array.isArray(asignaciones.reporte)) {
      return asignaciones.reporte;
    }
    return [];
  }, [asignaciones]);

  const columnasPDF = ['Fecha Programada', 'Plantacion', 'Usuarios', 'Actividad', 'Estado', 'Observaciones'];
  const datosPDF = useMemo(() => {
    if (asignacionesList.length === 0) {
      return [['No hay datos disponibles', '', '', '', '', '']];
    }
    return asignacionesList.map((asignacion: Asignacion) => [
      asignacion.fecha_programada || 'Sin fecha',
      asignacion.plantacion || 'Sin plantación',
      asignacion.usuarios.map((u) => u.nombre).join(', ') || 'Sin usuarios',
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
        data={asignacionesList.map((asignacion: Asignacion, index) => ({
          id: index,
          fecha_programada: asignacion.fecha_programada || 'Sin fecha',
          plantacion: asignacion.plantacion || 'Sin plantación',
          usuarios: asignacion.usuarios.map((u) => u.nombre).join(', ') || 'Sin usuarios',
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