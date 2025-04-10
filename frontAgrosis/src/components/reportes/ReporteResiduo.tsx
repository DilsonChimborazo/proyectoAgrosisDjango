import { useMemo } from 'react';
import { useReporteResiduos } from '../../hooks/reportes/useReporteResiduos';
import Tabla from '../../components/globales/Tabla';
import DescargarTablaPDF from '../../components/globales/DescargarTablaPDF';

const ReporteResiduos = () => {
  const { data: residuos, isLoading, isError } = useReporteResiduos();

  // Preparar datos para la tabla y el PDF
  const residuosList = useMemo(() => {
    return Array.isArray(residuos) ? residuos : [];
  }, [residuos]);

  const columnasPDF = ['Fecha', 'Tipo de Residuo', 'Cultivo'];
  const datosPDF = useMemo(() => {
    return residuosList.map(residuo => [
      residuo.fecha || 'Sin fecha',
      residuo.tipo_residuo || 'Sin tipo',
      residuo.cultivo || 'Sin cultivo'
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
          fecha: residuo.fecha || 'Sin fecha',
          tipo_de_residuo: residuo.tipo_residuo || 'Sin tipo',
          cultivo: residuo.cultivo || 'Sin cultivo'
        }))}
        onClickAction={(row) => console.log('Detalle:', row)}
        onUpdate={(row) => console.log('Actualizar:', row)}
        onCreate={() => console.log('Crear nuevo')}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_residuos.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Residuos"
            className="bg-green-600 hover:bg-green-700 text-white"
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