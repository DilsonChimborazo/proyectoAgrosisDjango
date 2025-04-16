import { useMemo } from "react";
import Tabla from "@/components/globales/Tabla";
import DescargarTablaPDF from "@/components/globales/DescargarTablaPDF";

interface HerramientaReporte {
  estado: string;
  cantidad: number;
  stock_total: number;
}

interface Props {
  data?: {
    reporte_por_estado: HerramientaReporte[];
    resumen_general: {
      total_herramientas: number;
      total_stock: number;
      estados_disponibles: string[];
    };
  };
  loading: boolean;
  error: any;
}

const ReporteHerramientas = ({ data, loading, error }: Props) => {
  const reporte = useMemo(() => {
    return data?.reporte_por_estado ?? [];
  }, [data]);

  const resumen = data?.resumen_general;

  const columnasPDF = ["Estado", "Cantidad", "Stock Total"];
  const datosPDF = useMemo(() => {
    const baseData = reporte.map(item => [
      item.estado,
      item.cantidad,
      item.stock_total
    ]);
    
    if (resumen) {
      return [
        ...baseData,
        ["TOTAL HERRAMIENTAS", resumen.total_herramientas, ""],
        ["TOTAL STOCK", "", resumen.total_stock],
        ["ESTADOS DISPONIBLES", resumen.estados_disponibles?.join(", ") || "N/A", ""]
      ];
    }
    return baseData;
  }, [reporte, resumen]);

  if (loading) return <div className="p-4">Cargando reporte...</div>;
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error al cargar el reporte: {error.message || String(error)}
      </div>
    );

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold">📊 Reporte de Herramientas por Estado</h2>
      <Tabla
        title=""
        headers={columnasPDF}
        data={reporte}
        onClickAction={(row) => console.log('Detalle:', row)}
        onUpdate={(row) => console.log('Actualizar:', row)}
        onCreate={() => console.log('Crear nuevo')}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_herramientas.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Herramientas por Estado"
          />
        }
      />

      {resumen && (
        <div className="mt-6 bg-white rounded-xl p-4 shadow">
          <h3 className="text-lg font-semibold mb-2">📌 Resumen General</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Total Herramientas: {resumen.total_herramientas}</li>
            <li>Total Stock: {resumen.total_stock}</li>
            <li>
              Estados Disponibles:{" "}
              {resumen.estados_disponibles?.join(", ") || "N/A"}
            </li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default ReporteHerramientas;