import { useState } from 'react';
import { useProduccion } from '../../../hooks/finanzas/produccion/useProduccion';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';


const Produccion = () => {
  const { data: produccion, isLoading, error } = useProduccion();
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

  const headers = ["ID", "Cantidad", "Fecha"];

  const handleRowClick = (produccion: object) => {
    openModalHandler(produccion);
  };

  if (isLoading) return <div>Cargando datos de producción...</div>;
  if (error instanceof Error) return <div>Error al cargar los datos: {error.message}</div>;

  const produccionList = Array.isArray(produccion) ? produccion : [];

  const mappedProduccion = produccionList.map((prod) => ({
    id: prod.id_produccion,
    cantidad: prod.cantidad_produccion ?? "No disponible",
    fecha: prod.fecha,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla title="Producción" headers={headers} data={mappedProduccion} onClickAction={handleRowClick} />
      {selectedProduccion && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles de Producción" contenido={selectedProduccion} />
      )}
    </div>
  );
};

export default Produccion;
