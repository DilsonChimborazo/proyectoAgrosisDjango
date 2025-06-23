import { useMemo } from "react";
import Tabla from "@/components/globales/Tabla";
import DescargarTablaPDF from "@/components/globales/DescargarTablaPDF";
import { InsumoBajoStock } from "@/hooks/inventario/insumos/useReporteInsumos";

interface Props {
  data?: InsumoBajoStock[];
  loading: boolean;
  error: unknown;
}

const ReporteInsumosBajoStock = ({ data, loading, error }: Props) => {
  const columnasPDF = ["Nombre", "Tipo", "Precio Unidad", "cantidad en base", "unidad medida"];

  const datosPDF = useMemo(() => {
    return (
      data?.map((item) => [
        item.nombre,
        item.tipo,
        `$${item.precio_unidad}`,
        item.cantidad_en_base,
        item.fk_unidad_medida
          ? `${item.fk_unidad_medida.unidad_base}`
          : "N/A",
      ]) || []
    );
  }, [data]);

  if (loading) return <div className="p-4">Cargando reporte...</div>;
  if (error)
    return (
      <div className="text-red-500 p-4">
        Error al cargar el reporte: {error instanceof Error ? error.message : String(error)}
      </div>
    );

  return (
    <div className="">
      <h2 className="text-xl font-semibold">📉 Reporte de Insumos con Bajo Stock</h2>

      <Tabla
        title=""
        headers={columnasPDF}
        data={data || []}
        hiddenColumnsByDefault={[]}
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="reporte_insumos_bajo_stock.pdf"
            columnas={columnasPDF}
            datos={datosPDF}
            titulo="Reporte de Insumos con Bajo Stock"
          />
        }
      />

      {data?.length === 0 && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 rounded text-green-700">
          ✅ Todos los insumos están por encima del umbral mínimo.
        </div>
      )}
    </div>
  );
};

export default ReporteInsumosBajoStock;
