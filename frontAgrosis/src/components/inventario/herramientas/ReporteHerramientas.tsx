import { useMemo } from "react";
import Tabla from "@/components/globales/Tabla"; 

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
  const reporte: HerramientaReporte[] = useMemo(() => {
    return data?.reporte_por_estado || [];
  }, [data]);

  const resumen = data?.resumen_general;

  const handleClickAction = (row: HerramientaReporte) => {
    console.log("click row:", row);
  };

  const handleUpdate = (row: HerramientaReporte) => {
    console.log("update row:", row);
  };

  const handleCreate = () => {
    console.log("crear no disponible");
  };

  if (loading) return <div className="p-4">Cargando reporte...</div>;
  if (error)
    return (
      <div className="text-red-500 p-4">Error al cargar el reporte</div>
    );

  return (
    <div className="p-4">
      <Tabla<HerramientaReporte>
        title="📊 Reporte de Herramientas por Estado"
        headers={["Estado", "Cantidad", "Stock Total"]}
        data={reporte}
        onClickAction={handleClickAction}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle=""
        hiddenColumnsByDefault={[]}
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
