import { useMemo } from 'react';
import { useReporteControles } from '../../../hooks/trazabilidad/control/useReporteControl';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';

const ReporteControlFitosanitario = () => {
  const { data: controles, isLoading, isError } = useReporteControles();

  // Preparar datos para la tabla y el PDF
  const controlesList = useMemo(() => {
    return Array.isArray(controles) ? controles : [];
  }, [controles]);

  const columnasPDF = ['Fecha Control', 'PlantaciOn', 'PEA', 'Tipo de Control', 'DescripciOn'];
  const datosPDF = useMemo(() => {
    return controlesList.map(control => [
      control.fecha_control || 'Sin fecha',
      control.plantacion || 'Sin plantación',
      control.pea || 'Sin PEA',
      control.tipo_control || 'Sin tipo',
      control.descripcion || 'Sin descripción'
    ]);
  }, [controlesList]);

  if (isLoading) return <div className="p-4">Cargando reporte...</div>;
  if (isError) return <div className="text-red-500 p-4">Error al cargar el reporte</div>;

  return (
    <div className="p-4">
      <Tabla
        title=" Reporte de Controles Fitosanitarios"
        headers={columnasPDF}
        data={controlesList.map((control, index) => ({
          id: index,
          fecha_control: control.fecha_control || 'Sin fecha',
          plantacion: control.plantacion || 'Sin plantación',
          pea: control.pea || 'Sin PEA',
          tipo_de_control: control.tipo_control || 'Sin tipo',
          descripcion: control.descripcion || 'Sin descripción'
        }))}
        onClickAction={(row) => console.log('Detalle:', row)}
        onUpdate={(row) => console.log('Actualizar:', row)}
        onCreate={() => console.log('Crear nuevo')}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_controles_fitosanitarios.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Controles Fitosanitarios"
          />
        }
      />
      <div className="mt-4 text-sm text-gray-500">
        Total de controles: {controlesList.length}
      </div>
    </div>
  );
};

export default ReporteControlFitosanitario;