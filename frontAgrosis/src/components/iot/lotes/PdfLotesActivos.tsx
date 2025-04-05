import useLotesActivos from "@/hooks/iot/lote/useLotesActivos";
import DescargarTablaPDF from "@/components/globales/DescargarTablaPDF";

const PdfLotesActivos = () => {
const { lotes, loading, error } = useLotesActivos();

const columnas = ["ID", "Nombre", "Dimensión", "Ubicación", "Estado"];
const datos = lotes.map((lote) => [
    lote.id,
    lote.nombre_lote,
    lote.dimencion,
    lote.fk_id_ubicacion
        ? `Lat: ${lote.fk_id_ubicacion.latitud}, Lon: ${lote.fk_id_ubicacion.longitud}`
        : "Sin ubicación",
    lote.estado,
]);

if (loading || error) return null;

return (
    <DescargarTablaPDF
        nombreArchivo="LotesActivos.pdf"
        titulo="Reporte de Lotes Activos"
        columnas={columnas}
        datos={datos}
    >
    </DescargarTablaPDF>
    );
};

export default PdfLotesActivos;
