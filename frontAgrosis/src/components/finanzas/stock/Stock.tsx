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

    // Estado para abrir el modal de "Registrar Venta"
    const [isVentaModalOpen, setIsVentaModalOpen] = useState(false);
    const [isProduccionModalOpen, setIsProduccionModalOpen] = useState(false);

    const openModalHandler = (stock: object) => {
        setSelectedStock(stock);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedStock(null);
        setIsModalOpen(false);
    };

    // Función para cerrar modales y refrescar datos
    const cerrarModalConExito = () => {
        setIsVentaModalOpen(false);
        setIsProduccionModalOpen(false);
        refetch(); // Refresca los datos del stock
    };

    const renderStockDetails = (stock: any) => {
        if (stock) {
            return (
                <div>
                    <p><strong>Origen:</strong> {stock.origen}</p>
                    <p><strong>Nombre:</strong> {stock.nombre}</p>
                    <p><strong>Movimiento:</strong> {stock.movimiento}</p>
                    <p><strong>Fecha:</strong> {stock.fecha}</p>
                    <p><strong>Cantidad:</strong> {stock.cantidad} {stock.unidad}</p>
                    {stock.precioUnidad && <p><strong>Precio por unidad:</strong> ${stock.precioUnidad}</p>}
                </div>
            );
        }
        return <p>No hay detalles disponibles</p>;
    };

    if (isLoading)
        return (
            <div className="text-center text-gray-500">
                Cargando movimientos de stock...
            </div>
        );
    if (error)
        return (
            <div className="text-center text-red-500">
                Error al cargar los datos: {error.message}
            </div>
        );

    const mappedStock = (stockData || []).map((registro) => {
        const fecha = registro.fk_id_produccion?.fecha || registro.fk_id_venta?.fecha || registro.fecha;
        const fechaFormateada = format(new Date(fecha), "MMMM dd yyyy", {
            locale: es,
        });
        
        const tipoMovimiento = registro.movimiento;
        const origen = tipoMovimiento === "Entrada" ? "Producción" : "Venta";

        let nombre = "No disponible";
        let unidad = "";
        let precioUnidad = null;

        if (tipoMovimiento === "Entrada" && registro.fk_id_produccion) {
            nombre = registro.fk_id_produccion.nombre_produccion || 
                     registro.fk_id_produccion.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 
                     "No disponible";
            unidad = registro.fk_id_produccion.fk_unidad_medida?.nombre_medida || "";
        } else if (tipoMovimiento === "Salida" && registro.fk_id_venta) {
            nombre = registro.fk_id_venta.fk_id_produccion?.nombre_produccion || 
                     registro.fk_id_venta.fk_id_produccion?.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo || 
                     "No disponible";
            unidad = registro.fk_id_venta.fk_unidad_medida?.nombre_medida || "";
            precioUnidad = registro.fk_id_venta.precio_unidad;
        }

        return {
            id: registro.id,
            origen,
            nombre,
            movimiento: <span className={tipoMovimiento === "Entrada" ? "text-green-700 font-bold" : "text-red-700 font-bold"}>{tipoMovimiento}</span>,
            fecha: fechaFormateada,
            cantidad: registro.cantidad,
            unidad,
            precioUnidad,
            rawData: registro
        };
    });

    const headers = [
        "ID",
        "Origen",
        "Nombre",
        "Movimiento",
        "Fecha",
        "Cantidad"
    ];

    return (
        <div className="mx-auto p-4 space-y-6">
            {/* Botón para registrar nueva venta */}
            <div className="flex justify-start mb-4 ml-5">
                <button
                    onClick={() => setIsVentaModalOpen(true)}
                    className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded mr-4"
                >
                    Registrar Venta
                </button>
                <button
                    onClick={() => setIsProduccionModalOpen(true)}
                    className="bg-green-600 hover:bg-green-800 text-white font-bold py-2 px-4 rounded"
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
                onUpdate={() => {}}
                onCreate={() => {}}
            />

            {/* Modal para mostrar detalle del movimiento de stock */}
            {selectedStock && (
                <VentanaModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                    titulo="Detalle de Movimiento de Stock"
                    contenido={renderStockDetails(selectedStock)}
                />
            )}

            {/* Modal para crear Venta */}
            {isVentaModalOpen && (
                <VentanaModal
                    isOpen={isVentaModalOpen}
                    onClose={cerrarModalConExito}
                    titulo=""
                    contenido={
                        <CrearVenta 
                            onClose={cerrarModalConExito}
                            onSuccess={cerrarModalConExito}
                        />
                    }
                />
            )}

            {/* Modal para crear Producción */}
            {isProduccionModalOpen && (
                <VentanaModal
                    isOpen={isProduccionModalOpen}
                    onClose={cerrarModalConExito}
                    titulo=""
                    contenido={
                        <CrearProduccion 
                            onClose={cerrarModalConExito}
                            onSuccess={cerrarModalConExito}
                        />
                    }
                />
            )}
        </div>
    );
};

export default Stock;