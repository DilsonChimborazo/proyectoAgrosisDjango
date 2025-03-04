import { useState } from 'react';
import { useInsumo } from '../../hooks/inventario/herramientas/useInsumo'
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Insumo = () => {
  const { data: insumo, isLoading, error } = useInsumo();
  const [selectedInsumo, setSelectedInsumo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (insumo: object) => {
    setSelectedInsumo(insumo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedInsumo(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Tipo', 'Precio_Unidad', 'Cantida', 'Unidad_Medida'];

  const handleRowClick = (insumo: object) => {
    openModalHandler(insumo);
  };

  if (isLoading) return <div>Cargando insumo...</div>;
  if (error instanceof Error) return <div>Error al cargar el insumo: {error.message}</div>;

  const InsumoList = Array.isArray(insumo) ? insumo : [];

  const mappedInsumo = InsumoList.map(insumo => ({
    id: insumo.id_insumo,
    nombre: insumo,
    tipo: insumo.tipo,
    precio_unidad: insumo.precio_unidad,
    cantidad: insumo.cantidad,
    unidad_medida: insumo.unidad_medida,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        title="insumo"
        headers={headers}
        data={mappedInsumo}
        onClickAction={handleRowClick}
      />
      {selectedInsumo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Lote"
          contenido={selectedInsumo} 
        />
      )}
    </div>
  );
};

export default Insumo;