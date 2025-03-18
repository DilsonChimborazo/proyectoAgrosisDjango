import { useState } from 'react';
import { usePea } from '../../../hooks/trazabilidad/pea/usePea';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Button from '../../globales/Button';
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

  if (isLoading) return <div>Cargando PEA...</div>;
  if (error instanceof Error) return <div>Error al cargar los PEA: {error.message}</div>;

  const peasList = Array.isArray(peas) ? peas : [];

  const mappedPeas = peasList.map(pea => ({
    id: pea.id,
    nombre_pea: pea.nombre_pea,
    descripcion: pea.descripcion,
    acciones: (
      <button 
        className="bg-blue-500 text-white px-3 py-1 rounded" 
        onClick={() => navigate(`/pea/editar/${pea.id}`)}
      >
        Editar
      </button>
    ),
  }));
  const headers = ['ID', 'Nombre', 'Descripción', 'Acciones'];


  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Button text="Crear PEA" className='mx-2' onClick={() => navigate("/crearpea")} variant="success" />

      <Tabla
        title="Lista de PEA"
        headers={headers}
        data={mappedPeas}
        onClickAction={handleRowClick}
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