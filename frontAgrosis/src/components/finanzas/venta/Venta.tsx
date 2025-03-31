import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta'; 
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import Button from "@/components/globales/Button";
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

  const ventasList = Array.isArray(ventas) ? ventas : [];
  const mappedVentas = ventasList.map((venta) => {
    // Asegurarse de que cantidad_produccion sea un número válido
    const cantidadProduccion = venta.fk_id_produccion?.cantidad_produccion ?? 0;
    const cantidadVendida = venta.cantidad ?? 0;

    // Calcular el stock disponible con una verificación adicional
    const stock = cantidadProduccion > cantidadVendida ? cantidadProduccion - cantidadVendida : 0;

    return {
      id_venta: venta.id_venta,
      cantidad_vendida: venta.cantidad,
      precio_unitario: venta.precio_unidad,
      total_venta: venta.cantidad * venta.precio_unidad,
      fecha_venta: venta.fecha,
      cantidad_producción: cantidadProduccion,
      fecha_producción: venta.fk_id_produccion?.fecha ?? "No disponible",
      nombre_produccion: venta.fk_id_produccion?.nombre_produccion ?? "No disponible",
      stock,
    };
  });

  const headers = ["ID Venta", "Cantidad Vendida", "Precio Unitario", "Total Venta", "Fecha Venta", "Cantidad Producción", "Fecha Producción", "Nombre Produccion", "Stock"];

  return (
    <div className="mx-auto p-4">
      <Button 
        text="Registrar Venta" 
        onClick={() => navigate("/Registrar-Venta")} 
        variant="green" 
      />

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
