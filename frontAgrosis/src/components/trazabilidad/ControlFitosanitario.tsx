import { useState } from 'react';
import { useControlFitosanitario } from '../../hooks/trazabilidad/controlFitosanitario/useControlFitosanitario';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';

const ControlFitosanitario = () => {
  const { data: controles, isLoading, error } = useControlFitosanitario();
  const [selectedControl, setSelectedControl] = useState<null | object>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (control: object) => {
    setSelectedControl(control);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedControl(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Fecha de Control', 'Descripción', 'Cultivo', 'PEA'];

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
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
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
