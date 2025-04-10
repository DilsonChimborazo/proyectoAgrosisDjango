import { useState } from 'react';
import { useControlFitosanitario } from '../../../hooks/trazabilidad/control/useControlFitosanitario';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
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

  const handleUpdate = (control: { id: number }) => {
    navigate(`/controlfitosanitario/editar/${control.id}`);
  };

  const handleCreate = () => {
    navigate("/crearcontrolfitosanitario");
  };

  if (isLoading) return <div>Cargando Controles Fitosanitarios...</div>;
  if (error instanceof Error) return <div>Error al cargar los controles: {error.message}</div>;

  const controlesList = Array.isArray(controles) ? controles : [];

  const mappedControles = controlesList.map(control => ({
    id: control.id,
    fecha_control: new Date(control.fecha_control).toLocaleDateString(),
    descripcion: control.descripcion,
    tipo_control: control.tipo_control,
    cultivo: control.fk_id_cultivo
      ? control.fk_id_cultivo.nombre_cultivo
      : "Sin cultivo",
    pea: control.fk_id_pea
      ? control.fk_id_pea.nombre_pea
      : "Sin pea",
    insumo: control.fk_id_insumo
      ? control.fk_id_insumo.nombre
      : "Sin insumo",
    cantidad_insumo: control.cantidad_insumo,
  }));

  const headers = ['ID', 'Fecha Control', 'Descripcion','Tipo control', 'Cultivo', 'Pea', 'Insumo','Cantidad insumo'];

  return (
    <div className="overflow-x-auto  rounded-lg">

      <Tabla
        title="Lista de Controles Fitosanitarios"
        headers={[...headers]}
        data={mappedControles}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate} 
        onCreate={handleCreate}
        createButtonTitle="Crear"
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
