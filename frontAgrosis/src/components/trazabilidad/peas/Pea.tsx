import { useState } from 'react';
import { usePea } from '../../../hooks/trazabilidad/pea/usePea';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';

const Pea = () => {
  const { data: peas, isLoading, error } = usePea();
  const [selectedPea, setSelectedPea] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (pea: object) => {
    setSelectedPea(pea);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setSelectedPea(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (pea: object) => {
    openModalHandler(pea);
  };

  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/pea/editar/${residuo.id}`);
  };
  const handleCreate = () => {
    navigate("/crearpea");
  };

  if (isLoading) return <div>Cargando PEA...</div>;
  if (error instanceof Error) return <div>Error al cargar los PEA: {error.message}</div>;

  const peasList = Array.isArray(peas) ? peas : [];

  const mappedPeas = peasList.map(pea => ({
    id: pea.id,
    nombre_pea: pea.nombre_pea,
    descripcion: pea.descripcion
  }));
  const headers = ['ID', 'Nombre Pea', 'Descripcion'];


  return (
    <div className="overflow-x-auto  rounded-lg">

      <Tabla
        title="Lista de PEA"
        headers={headers}
        data={mappedPeas}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedPea && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del PEA"
          contenido={selectedPea} 
        />
      )}
    </div>
  );
};

export default Pea;