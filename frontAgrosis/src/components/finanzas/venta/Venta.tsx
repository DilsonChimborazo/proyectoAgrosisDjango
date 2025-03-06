import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta'; // Ajusta la ruta según tu estructura
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';

const VentaComponent = () => {
  const { data: ventas, isLoading, error } = useVenta();
  const [selectedVenta, setSelectedVenta] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (venta: object) => {
    setSelectedVenta(venta);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedVenta(null);
    setIsModalOpen(false);
  };

  // Encabezados para la tabla de ventas
  const headers = [
    "ID Venta",
    "Cantidad Vendida",
    "Precio Unitario",
    "Total Venta",
    "Fecha Venta",
    "Cantidad Producción",
    "Fecha Producción"
  ];

  const handleRowClick = (venta: object) => {
    openModalHandler(venta);
  };

  if (isLoading) return <div>Cargando datos de ventas...</div>;
  if (error instanceof Error) return <div>Error al cargar los datos: {error.message}</div>;

  const ventasList = Array.isArray(ventas) ? ventas : [];

  // Mapeo de los datos para la tabla
  const mappedVentas = ventasList.map((venta) => ({
    id: venta.id_venta,
    cantidad: venta.cantidad,
    precio_unitario: venta.precio_unitario,
    total_venta: venta.total_venta ?? "No disponible", // Puede ser null en la DB
    fecha_venta: venta.fecha_venta,
    cantidad_produccion: venta.fk_id_produccion?.cantidad_produccion ?? "No disponible",
    fecha_produccion: venta.fk_id_produccion?.fecha ?? "No disponible",
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla title="Ventas" headers={headers} data={mappedVentas} onClickAction={handleRowClick} />
      {selectedVenta && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Venta"
          contenido={selectedVenta}
        />
      )}
    </div>
  );
};

export default VentaComponent;