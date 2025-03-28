import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta'; // Ajusta la ruta según tu estructura
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from "react-router-dom";

const VentaComponent = () => {
  const navigate = useNavigate();
  const { data: ventas, isLoading, error } = useVenta();
  const [selectedVenta, setSelectedVenta] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (venta: object) => {
    setSelectedVenta(venta);
    setIsModalOpen(true);
  };

  const handleRowClick = (venta: { id_venta: number }) => {
    openModalHandler(venta);
  };

  const closeModal = () => {
    setSelectedVenta(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (cultivo: { id_venta: number }) => {
    navigate(`/actualizarventa/${cultivo.id_venta}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Venta");

  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const ventasList = Array.isArray(ventas) ? ventas : [];
  const mappedVentas = ventasList.map((venta) => ({
    id_venta: venta.id_venta,
    cantidad: venta.cantidad,
    precio_unitario: venta.precio_unidad,
    total_venta: venta.cantidad * venta.precio_unidad,
    fecha_venta: venta.fecha,
    cantidad_produccion: venta.fk_id_produccion?.cantidad_produccion ?? "No disponible",
    fecha_produccion: venta.fk_id_produccion?.fecha ?? "No disponible",
  }));

  const headers = ["ID Venta", "Cantidad", "Precio Unitario", "Total Venta", "Fecha Venta", "Cantidad Produccion", "Fecha Produccion",];

  return (
    <div className="mx-auto p-4">
      <Tabla 
        title="Lista de Ventas" 
        headers={headers} 
        data={mappedVentas} 
        onClickAction={handleRowClick} 
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

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
