import { useMemo } from 'react';
import { useReporteResiduos } from '../../../hooks/trazabilidad/residuo/useReporteResiduos';
import Tabla from '../../globales/Tabla';
import DescargarTablaPDF from '../../globales/DescargarTablaPDF';

// Define the interface for the component props
interface ReporteResiduosProps {
  data: ReporteResiduo[] | undefined;
  loading: boolean;
  error: boolean;
}

interface ReporteResiduo {
  fecha: string;
  cultivo: string;
  residuo: string;
}

const ReporteResiduos = ({ data: residuosFromProps, loading: isLoadingFromProps, error: isErrorFromProps }: ReporteResiduosProps) => {
  // Use the hook as originally intended
  const { data: residuosFromHook, isLoading: isLoadingFromHook, isError: isErrorFromHook } = useReporteResiduos();

  // Use props if provided, otherwise fall back to hook data
  const residuos = residuosFromProps ?? residuosFromHook;
  const isLoading = isLoadingFromProps || isLoadingFromHook;
  const isError = isErrorFromProps || isErrorFromHook;

  // Preparar datos para la tabla y el PDF
  const residuosList = useMemo(() => {
    return Array.isArray(residuos) ? residuos : [];
  }, [residuos]);

  const columnasPDF = ['Fecha', 'Cultivo', 'Residuo'];
  const datosPDF = useMemo(() => {
    return residuosList.map(residuo => [
      residuo.fecha ? new Date(residuo.fecha).toLocaleDateString() : 'Sin fecha',
      residuo.cultivo || 'Sin cultivo',
      residuo.residuo || 'Sin residuo'
    ]);
  }, [residuosList]);

  if (isLoading) return <div className="p-4">Cargando reporte...</div>;
  if (isError) return <div className="text-red-500 p-4">Error al cargar el reporte</div>;

  return (
    <div className="p-4">
      <Tabla
        title="Reporte de Residuos"
        headers={columnasPDF}
        data={residuosList.map((residuo, index) => ({
          id: index,
          fecha: residuo.fecha ? new Date(residuo.fecha).toLocaleDateString() : 'Sin fecha',
          cultivo: residuo.cultivo || 'Sin cultivo',
          residuo: residuo.residuo || 'Sin residuo'
        }))}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_residuos.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Residuos"
          />
        }
      />
      <div className="mt-4 text-sm text-gray-500">
        Total de residuos registrados: {residuosList.length}
      </div>
    </div>
  );
};

export default ReporteResiduos;