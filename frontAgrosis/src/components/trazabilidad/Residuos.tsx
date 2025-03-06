import { useState } from 'react';
import { useResiduos } from '../../hooks/trazabilidad/useResiduos';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';

const Residuos = () => {
  const { data: residuos, isLoading, error } = useResiduos();
  const [selectedResiduo, setSelectedResiduo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (residuo: object) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Fecha', 'Descripción', 'Cultivo', 'Tipo de Residuo'];

  const handleRowClick = (residuo: object) => {
    openModalHandler(residuo);
  };

  if (isLoading) return <div>Cargando residuos...</div>;
  if (error instanceof Error) return <div>Error al cargar los residuos: {error.message}</div>;

  const residuosList = Array.isArray(residuos) ? residuos : [];

  const mappedResiduos = residuosList.map(residuo => ({
    id: residuo.id,
    nombre_residuo: residuo.nombre_residuo,
    fecha: new Date(residuo.fecha).toLocaleDateString(),
    descripcion: residuo.descripcion,
    cultivo: residuo.fk_id_cultivo ? residuo.fk_id_cultivo.nombre_cultivo : 'Sin cultivo',
    tipo_residuo: residuo.fk_id_tipo_residuo ? residuo.fk_id_tipo_residuo.nombre_tipo_residuo : 'Sin tipo',
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        title="Lista de Residuos"
        headers={headers}
        data={mappedResiduos}
        onClickAction={handleRowClick}
      />
      {selectedResiduo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Residuo"
          contenido={selectedResiduo} 
        />
      )}
    </div>
  );
};

export default Residuos;
