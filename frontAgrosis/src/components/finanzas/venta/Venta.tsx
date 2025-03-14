import { useState } from 'react';
import { useVenta } from '../../../hooks/finanzas/venta/useVenta'; // Ajusta la ruta según tu estructura
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

  const closeModal = () => {
    setSelectedVenta(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando ventas...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const ventasList = Array.isArray(ventas) ? ventas : [];
  const mappedVentas = ventasList.map((venta) => ({
    id: venta.id_venta,
    cantidad: venta.cantidad,
    precio_unitario: venta.precio_unidad,
    total_venta: venta.total_venta ?? "No disponible", 
    fecha_venta: venta.fecha,
    cantidad_produccion: venta.fk_id_produccion?.cantidad_produccion ?? "No disponible",
    fecha_produccion: venta.fk_id_produccion?.fecha ?? "No disponible",
  }));

  const headers = ["ID Venta", "Cantidad Vendida", "Precio Unitario", "Total Venta", "Fecha Venta", "Cantidad Producción", "Fecha Producción"];

  return (
    <div className="mx-auto p-4">
      <Button 
        text="Registrar Venta" 
        onClick={() => navigate("/Registrar-Venta")} 
        variant="success" 
      />

      <Tabla 
        title="Lista de Ventas" 
        headers={headers} 
        data={mappedVentas} 
        onClickAction={openModalHandler} 
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