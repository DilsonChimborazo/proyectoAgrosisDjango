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
  const [selectedStock, setSelectedStock] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
  const [isProduccionModalOpen, setIsProduccionModalOpen] = useState(false);

  // Abrir modal detalle stock
  const openModalHandler = (stock: object) => {
    setSelectedStock(stock);
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

    return (
      <div className="space-y-1">
        <p><strong>Origen:</strong> {stock.origen}</p>
        <p><strong>Nombre:</strong> {stock.nombre}</p>
        <p><strong>Movimiento:</strong> {stock.movimiento}</p>
        <p><strong>Fecha:</strong> {stock.fecha}</p>
        <p><strong>Cantidad:</strong> {stock.cantidad}</p>
        {stock.precioUnidad !== null && stock.precioUnidad !== undefined && (
          <p><strong>Precio por unidad:</strong> ${stock.precioUnidad}</p>
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
    const fecha = registro.fk_id_produccion?.fecha || registro.fk_id_item_venta?.fecha || registro.fecha;
    const fechaFormateada = fecha
      ? format(new Date(fecha), "dd 'de' MMMM yyyy", { locale: es })
      : "Fecha no disponible";

    const tipoMovimiento = registro.movimiento;
    const origen = tipoMovimiento === "Entrada" ? "Producción" : "Venta";

    let nombre = "No disponible";
    let unidadBase = "";
    let precioUnidad = null;

    if (tipoMovimiento === "Entrada" && registro.fk_id_produccion) {
      nombre =
        registro.fk_id_produccion.nombre_produccion ||
        registro.fk_id_produccion.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo ||
        "No disponible";

      unidadBase = registro.fk_id_produccion.fk_unidad_medida?.unidad_base || "";
    } else if (tipoMovimiento === "Salida" && registro.fk_id_item_venta) {
      nombre =
        registro.fk_id_item_venta.produccion?.nombre_produccion ||
        registro.fk_id_item_venta.produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo ||
        "No disponible";

      unidadBase = registro.fk_id_item_venta.unidad_medida?.unidad_base || "";
      precioUnidad = registro.fk_id_item_venta.precio_unidad;
    }

    return {
      id: registro.id,
      origen,
      nombre,
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
      cantidad: `${registro.cantidad} ${unidadBase}`,
      precioUnidad,
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
        />
      )}

      {/* Modal Crear Venta */}
      {isVentaModalOpen && (
        <VentanaModal
          isOpen={isVentaModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Venta"
          size="venta" // Usamos el tamaño especial
          contenido={<CrearVenta onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
        />
      )}
      
      {/* Modal Crear Producción */}
      {isProduccionModalOpen && (
        <VentanaModal
          isOpen={isProduccionModalOpen}
          onClose={cerrarModalConExito}
          titulo="Registrar Producción"
          contenido={<CrearProduccion onClose={cerrarModalConExito} onSuccess={cerrarModalConExito} />}
        />
      )}
    </div>
  );
};

export default Stock;
