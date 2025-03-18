import { useState } from 'react';
import { useControlFitosanitario } from '../../../hooks/trazabilidad/control/useControlFitosanitario';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Button from '../../globales/Button';
import { useNavigate } from 'react-router-dom';


const ControlFitosanitario = () => {
  const { data: controles, isLoading, error } = useControlFitosanitario();
  const [selectedControl, setSelectedControl] = useState<null | object>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (control: object) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedControl(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (control: object) => {
    openModalHandler(control);
  };

  if (isLoading) return <div>Cargando Controles Fitosanitarios...</div>;
  if (error instanceof Error) return <div>Error al cargar los controles: {error.message}</div>;

  const controlesList = Array.isArray(controles) ? controles : [];

  const mappedControles = controlesList.map(control => ({
    id: control.id,
    fecha_control: new Date(control.fecha_control).toLocaleDateString(),
    descripcion: control.descripcion,
    cultivo: control.fk_id_desarrollan?.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
    pea: control.fk_id_desarrollan?.fk_id_pea?.nombre_pea || 'Sin PEA',
    acciones: (
      <button 
        className="bg-blue-500 text-white px-3 py-1 rounded" 
        onClick={() => navigate(`/controlfitosanitario/editar/${control.id}`)}
      >
        Editar
      </button>
    ),
  }));

  const headers = ['ID', 'Fecha de Control', 'Descripción', 'Cultivo', 'PEA', 'Acciones'];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Button text="Crear Control Fitosanitario" className='mx-2' onClick={() => navigate("/crearcontrolfitosanitario")} variant="success" />

      <Tabla
        title="Lista de Controles Fitosanitarios"
        headers={headers}
        data={mappedControles}
        onClickAction={handleRowClick}
      />

      {selectedControl && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Control Fitosanitario"
          contenido={selectedControl} 
        />
      )}
    </div>
  );
};

export default ControlFitosanitario;
