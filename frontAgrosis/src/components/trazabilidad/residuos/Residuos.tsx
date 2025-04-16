import { useState } from 'react';
import { useResiduos } from '../../../hooks/trazabilidad/residuo/useResiduos';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';

const Residuos = () => {
  const { data: residuos, isLoading, error } = useResiduos();
  const [selectedResiduo, setSelectedResiduo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (residuo: object) => {
    setSelectedResiduo(residuo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (residuo: object) => {
    openModalHandler(residuo);
  };
  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/residuos/editar/${residuo.id}`);
  };
  const handleCreate = () => {
    navigate("/crearresiduo");
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
    tipo_residuo: residuo.fk_id_tipo_residuo ? residuo.fk_id_tipo_residuo.nombre_tipo_residuo : 'Sin tipo'
  }));

  const headers = ['ID', 'Nombre residuo', 'Fecha', 'Descripcion', 'Cultivo', 'Tipo Residuo'];

  return (
    <div className="overflow-x-auto  rounded-lg">

      <Tabla
        title="Lista de Residuos"
        headers={headers}
        data={mappedResiduos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate} 
        onCreate={handleCreate}
        createButtonTitle="Crear"
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
