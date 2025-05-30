import { useState } from "react";
import { useStock } from "../../../hooks/finanzas/stock/useStock";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import CrearVenta from "../venta/CrearVenta";
import CrearProduccion from "../produccion/CrearProduccion";

const Stock = () => {
  const { data: stockData, isLoading, error, refetch } = useStock();
  const [selectedStock, setSelectedStock] = useState<any | null>(null); // Usar 'any' temporalmente para flexibilidad de renderizado
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [isProduccionModalOpen, setIsProduccionModalOpen] = useState(false);

  // Abrir modal detalle stock
  const openModalHandler = (stock: any) => {
    setSelectedStock(stock.rawData); 
    setIsModalOpen(true);
  };

  // Cerrar modal detalle stock
  const closeModal = () => {
    setSelectedStock(null);
    setIsModalOpen(false);
  };

  // Cerrar modales venta/producción y refrescar lista
  const cerrarModalConExito = () => {
    setIsVentaModalOpen(false);
    setIsProduccionModalOpen(false);
    refetch(); 
  };

  // Renderiza los detalles de un registro de stock
  const renderStockDetails = (stock: any) => {
    if (!stock) return <p>No hay detalles disponibles</p>;

    const tipoMovimiento = stock.movimiento;
    const nombreProducto = stock.fk_id_produccion?.nombre_produccion || stock.fk_id_item_venta?.produccion?.nombre_produccion || 'N/A';
    const unidadMedida = stock.fk_id_produccion?.fk_unidad_medida?.nombre_medida || stock.fk_id_item_venta?.unidad_medida?.nombre_medida || 'N/A';
    const unidadBase = stock.fk_id_produccion?.fk_unidad_medida?.unidad_base || stock.fk_id_item_venta?.unidad_medida?.unidad_base || 'N/A';

    return (
      <div className="space-y-3 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-bold text-gray-800 border-b pb-2 mb-2">Detalles del Movimiento</h3>
        <p><strong>ID Movimiento:</strong> {stock.id}</p>
        <p><strong>Tipo de Movimiento:</strong> <span className={tipoMovimiento === "Entrada" ? "text-green-600 font-semibold" : "text-red-600 font-semibold"}>{tipoMovimiento}</span></p>
        <p><strong>Fecha:</strong> {format(new Date(stock.fecha), "dd 'de' MMMM 'de' yyyy, HH:mm", { locale: es })}</p>
        <p><strong>Cantidad:</strong> {stock.cantidad} {unidadMedida} ({unidadBase})</p>

        {stock.fk_id_produccion && (
          <div className="mt-4 border-t pt-2">
            <h4 className="font-bold text-gray-700">Información de Producción:</h4>
            <p><strong>Producción:</strong> {nombreProducto}</p>
            <p><strong>Stock Inicial:</strong> {stock.fk_id_produccion.cantidad_en_base} {stock.fk_id_produccion.fk_unidad_medida?.unidad_base}</p>
            <p><strong>Stock Disponible (actual):</strong> {stock.fk_id_produccion.stock_disponible} {stock.fk_id_produccion.fk_unidad_medida?.unidad_base}</p>
            {stock.fk_id_produccion.precio_sugerido_venta !== null && (
              <p><strong>Precio Sugerido Venta:</strong> ${stock.fk_id_produccion.precio_sugerido_venta?.toFixed(2)}/{stock.fk_id_produccion.fk_unidad_medida?.unidad_base}</p>
            )}
          </div>
        )}

        {stock.fk_id_item_venta && (
          <div className="mt-4 border-t pt-2">
            <h4 className="font-bold text-gray-700">Información de Venta:</h4>
            <p><strong>ID Venta:</strong> {stock.fk_id_item_venta.venta.id}</p>
            <p><strong>Producto Vendido:</strong> {nombreProducto}</p>
            <p><strong>Cantidad Vendida:</strong> {stock.fk_id_item_venta.cantidad} {stock.fk_id_item_venta.unidad_medida?.nombre_medida}</p>
            <p><strong>Precio por unidad de Venta:</strong> ${stock.fk_id_item_venta.precio_unidad?.toFixed(2)}/{stock.fk_id_item_venta.unidad_medida?.nombre_medida}</p>
            <p><strong>Subtotal del Item:</strong> ${stock.fk_id_item_venta.subtotal?.toFixed(2)}</p>
            <p><strong>Total de la Venta:</strong> ${stock.fk_id_item_venta.venta.total?.toFixed(2)}</p>
            {stock.fk_id_item_venta.venta.descuento_porcentaje > 0 && (
              <p><strong>Descuento Aplicado:</strong> {stock.fk_id_item_venta.venta.descuento_porcentaje}%</p>
            )}
          </div>
        )}
      </div>
    );
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando movimientos de stock...</div>;

  if (error)
    return (
      <div className="text-center text-red-500">
        Error al cargar los datos: {error.message || "Error desconocido"}
      </div>
    );

  // Mapeo y formateo de datos para la tabla
  const mappedStock = (stockData || []).map((registro) => {
    // Obtener fecha preferida
    const fecha = registro.fecha; 
    const fechaFormateada = fecha
      ? format(new Date(fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })
      : "Fecha no disponible";

    const tipoMovimiento = registro.movimiento;
    const origen = tipoMovimiento === "Entrada" ? "Producción" : "Venta";

    let nombre = "No disponible";
    let unidadDisplay = "";

    if (tipoMovimiento === "Entrada" && registro.fk_id_produccion) {
      nombre =
        registro.fk_id_produccion.nombre_produccion ||
        registro.fk_id_produccion.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo ||
        "No disponible";
      unidadDisplay = registro.fk_id_produccion.fk_unidad_medida?.nombre_medida || registro.fk_id_produccion.fk_unidad_medida?.unidad_base || "";
    } else if (tipoMovimiento === "Salida" && registro.fk_id_item_venta) {
      nombre =
        registro.fk_id_item_venta.produccion?.nombre_produccion ||
        registro.fk_id_item_venta.produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo ||
        "No disponible";
      unidadDisplay = registro.fk_id_item_venta.unidad_medida?.nombre_medida || registro.fk_id_item_venta.unidad_medida?.unidad_base || "";
    }

    return {
      id: registro.id,
      origen,
      nombre: (
        <div>
          <div className="font-semibold">{nombre}</div>
          {tipoMovimiento === "Salida" && registro.fk_id_item_venta?.venta && (
            <div className="text-sm text-gray-600">
              Venta #{registro.fk_id_item_venta.venta.id}
              {registro.fk_id_item_venta.venta.descuento_porcentaje > 0 && ` (-${registro.fk_id_item_venta.venta.descuento_porcentaje}%)`}
            </div>
          )}
        </div>
      ),
      movimiento: (
        <span
          className={
            tipoMovimiento === "Entrada"
              ? "text-green-700 font-bold"
              : "text-red-700 font-bold"
          }
        >
          {tipoMovimiento}
        </span>
      ),
      fecha: fechaFormateada,
      cantidad: `${registro.cantidad} ${unidadDisplay}`,
      rawData: registro, 
    };
  });

  const headers = ["ID", "Origen", "Nombre", "Movimiento", "Fecha", "Cantidad"];

  return (
    <div className="mx-auto p-4 space-y-6">
      <div className="flex justify-start mb-4 ml-5 space-x-4">
        <button
          onClick={() => setIsVentaModalOpen(true)}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          Registrar Venta
        </button>
        <button
          onClick={() => setIsProduccionModalOpen(true)}
          className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
          type="button"
        >
          Registrar Producción
        </button>
      </div>

      <Tabla
        createButtonTitle="Crear"
        title="Movimientos de Stock"
        headers={headers}
        data={mappedStock}
        onClickAction={openModalHandler}
        onUpdate={() => { }}
        onCreate={() => { }}
      />

      {/* Modal detalle stock */}
      {selectedStock && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalle de Movimiento de Stock"
          contenido={renderStockDetails(selectedStock)}
          size="lg"
        />
      )}

      {/* Modal Crear Venta */}
      {isVentaModalOpen && (
        <VentanaModal
          isOpen={isVentaModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Venta"
          size="1.5xl"
          contenido={<CrearVenta onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
        />
      )}

      {/* Modal Crear Producción */}
      {isProduccionModalOpen && (
        <VentanaModal
          isOpen={isProduccionModalOpen}
          onClose={cerrarModalConExito}
          titulo=""
          contenido={<CrearProduccion onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
        />
      )}
    </div>
  );
};

export default Stock;