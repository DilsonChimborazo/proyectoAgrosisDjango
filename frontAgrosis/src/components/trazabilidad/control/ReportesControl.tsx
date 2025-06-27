import { useMemo } from 'react';
import { useReporteControles } from '../../../hooks/trazabilidad/control/useReporteControl';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';

// Define the interface for the component props
interface ReporteControlProps {
  data: ReporteControl[] | undefined;
  loading: boolean;
  error: Error | null;
}

interface ReporteControl {
  fecha_control: Date;
  plantacion: string;
  cultivo: string;
  pea: string;
  tipo_control: string;
  descripcion: string;
}

const ReporteControlFitosanitario = ({ data: controlesFromProps, loading: isLoadingFromProps, error: isErrorFromProps }: ReporteControlProps) => {
  // Use the hook as originally intended
  const { data: controlesFromHook, isLoading: isLoadingFromHook, isError: isErrorFromHook } = useReporteControles();

  // Use props if provided, otherwise fall back to hook data
  const controles = controlesFromProps ?? controlesFromHook;
  const isLoading = isLoadingFromProps || isLoadingFromHook;
  const isError = isErrorFromProps || isErrorFromHook;

  // Asegurar que controles sea un arreglo
  const controlesList = useMemo(() => {
    return Array.isArray(controles) ? controles : [];
  }, [controles]);

  const columnasPDF = ['Fecha Control', 'Plantacion', 'PEA', 'Tipo de Control', 'Descripcion'];

  const datosPDF = useMemo(() => {
    return controlesList.map((control) => [
      control?.fecha_control
        ? new Date(control.fecha_control).toLocaleDateString()
        : 'Sin fecha',
      control?.plantacion ?? 'Sin plantación',
      control?.pea ?? 'Sin PEA',
      control?.tipo_control ?? 'Sin tipo',
      control?.descripcion ?? 'Sin descripción',
    ]);
  }, [controlesList]);

  if (isLoading) return <div className="p-4">Cargando reporte...</div>;
  if (isError) return <div className="text-red-500 p-4">Error al cargar el reporte</div>;

  return (
    <div className="p-4">
      <Tabla
        title="Reporte de Controles Fitosanitarios"
        headers={columnasPDF}
        data={controlesList.map((control, index) => ({
          id: index,
          fecha_control: control?.fecha_control
            ? new Date(control.fecha_control).toLocaleDateString()
            : 'Sin fecha',
          plantacion: control?.plantacion ?? 'Sin plantación',
          pea: control?.pea ?? 'Sin PEA',
          tipo_de_control: control?.tipo_control ?? 'Sin tipo',
          descripcion: control?.descripcion ?? 'Sin descripción',
        }))}
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