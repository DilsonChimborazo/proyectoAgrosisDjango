import { useState } from 'react';
import { useProduccion } from '../../../hooks/finanzas/produccion/useProduccion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from "react-router-dom";
import Button from '@/components/globales/Button';

const ProduccionComponent = () => {
  const navigate = useNavigate();
  const { data: producciones, isLoading, error } = useProduccion();
  const [selectedProduccion, setSelectedProduccion] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (produccion: object) => {
    setSelectedProduccion(produccion);
    setIsModalOpen(true);
  };

  const handleRowClick = (produccion: { id: number }) => {
    openModalHandler(produccion);
  };

  const closeModal = () => {
    setSelectedProduccion(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (produccion: { id: number }) => {
    navigate(`/actualizarproduccion/${produccion.id}`);
  };

  const handleCreate = () => {
    navigate("/Registrar-Produccion");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando producciones...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const produccionesList = Array.isArray(producciones) ? producciones : [];
  const mappedProducciones = produccionesList.map((produccion) => ({
    id: produccion.id,
    nombre_produccion: produccion.nombre_produccion,
    cantidad_producida: produccion.cantidad_producida,
    unidad_medida: produccion.fk_unidad_medida?.nombre_medida ?? 'No disponible',
    fecha: produccion.fecha,
    stock_disponible: produccion.stock_disponible ?? 0,
    cultivo: produccion.fk_id_plantacion?.fk_id_cultivo?.nombre_cultivo ?? 'Sin cultivo',
    fecha_plantacion: produccion.fk_id_plantacion?.fecha_plantacion ?? 'Sin fecha',
  }));

  const headers = [
    "ID", "Nombre Produccion", "Cantidad Producida", "Unidad Medida", "Fecha", 
    "Stock Disponible", "Cultivo", "Fecha Plantacion"
  ];

  return (
    <div className="mx-auto p-4">
      <div className="flex gap-4 my-4">
        <Button 
          text="Registrar Producción" 
          onClick={handleCreate} 
          variant="green" 
        />
      </div>

      <Tabla 
        title="Lista de Producciones" 
        headers={headers} 
        data={mappedProducciones} 
        onClickAction={handleRowClick} 
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
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
