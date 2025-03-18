import { useState } from 'react';
import { useProduccion } from '../../../hooks/finanzas/produccion/useProduccion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import Button from "@/components/globales/Button";
import { useNavigate } from "react-router-dom";

const ProduccionComponent = () => {
  const navigate = useNavigate();
  const { data: producciones, isLoading, error } = useProduccion();
  const [selectedProduccion, setSelectedProduccion] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (produccion: object) => {
    setSelectedProduccion(produccion);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando producciones...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de los datos para la tabla
  const produccionList = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionList.map((produccion) => ({
    id: produccion.id_produccion,
    cantidad_produccion: produccion.cantidad_produccion?.toString() ?? "No disponible",
    fecha_produccion: produccion.fecha ?? "No disponible",
    nombre_cultivo: produccion.fk_id?.nombre_cultivo ?? "No disponible",
    fecha_plantacion: produccion.fk_id?.fecha_plantacion ?? "No disponible",
  }));

  const headers = ["ID Producción", "Cantidad Producción", "Fecha Producción", "Cultivo", "Fecha Plantación"];

  return (
    <div className="mx-auto p-4">
      <Button 
        text="Registrar Producción" 
        onClick={() => navigate("/Registrar-Producción")} 
        variant="success" 
      />

      <Tabla 
        title="Lista de Producciones" 
        headers={headers} 
        data={mappedProducciones} 
        onClickAction={openModalHandler} 
      />

      {selectedProduccion && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Producción"
          contenido={selectedProduccion}
        />
      )}
    </div>
  );
};

export default ProduccionComponent;
