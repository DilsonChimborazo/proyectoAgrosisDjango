import { useTiposResiduos } from '@/hooks/trazabilidad/tipoResiduo/useTipoResiduo';
import Tabla from '../../globales/Tabla';
import { useState } from 'react';
import VentanaModal from '../../globales/VentanasModales';
import { useNavigate } from 'react-router-dom';

const ListarTiposResiduos = () => {
  const { data: tiposResiduos, isLoading, error } = useTiposResiduos();
  const [selectedTipoResiduo, setSelectedTipoResiduo] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleRowClick = (tipo: any) => {
    setSelectedTipoResiduo(tipo);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();

  const closeModal = () => {
    setSelectedTipoResiduo(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (tipo: { id: number }) => {
    navigate(`/ActualizarTipoResiduos/${tipo.id}`);
  };

  const handleCreate = () => {
    navigate('/CrearTipoResiduos');
  };

  if (isLoading) return <div>Cargando tipos de residuos...</div>;
  if (error instanceof Error) return <div>Error al cargar tipos de residuos: {error.message}</div>;

  const mappedTiposResiduos = tiposResiduos?.map((t) => ({
    id: t.id,
    nombre: t.nombre,
    descripcion: t.descripcion,
  })) || [];

  return (
    <div>
      <Tabla
        title="Tipos de Residuos"
        headers={['ID', 'Nombre', 'Descripción']}
        data={mappedTiposResiduos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />
      {selectedTipoResiduo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Tipo de Residuo"
          contenido={selectedTipoResiduo}
        />
      )}
    </div>
  );
};

export default ListarTiposResiduos;