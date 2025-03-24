
import { useState } from 'react';
import { useAsignacion } from '../../../hooks/trazabilidad/asignacion/useAsignacion';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';




const Asignaciones = () => {
  const { data: asignaciones, error, isLoading } = useAsignacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<any>(null);

  const openModal = (asignacion: any) => {
    setSelectedAsignacion(asignacion);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsignacion(null);
  };

  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/actualizarasignacion/${residuo.id}`);
  };

  const handleCreate = () => {
    navigate("/CrearAsignacion");
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const tablaData = (asignaciones ?? []).map((asignacion) => ({
    id: asignacion.id,
    fecha: asignacion.fecha
      ? new Date(asignacion.fecha).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Sin fecha",
    observaciones: asignacion.observaciones || "N/A",
    actividad: asignacion.fk_id_actividad?.nombre_actividad || "Sin actividad",
    usuario: asignacion.id_identificacion
      ? `${asignacion.id_identificacion.nombre} ${asignacion.id_identificacion.apellido}`
      : "Sin usuario",
  }));

  const headers = ["ID", "Fecha", "Observaciones", "Actividad", "Usuario"];

  return (
    <div className="">
      <Tabla
        title="Lista de Asignaciones"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />


      {selectedAsignacion && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles de la Asignación" contenido={selectedAsignacion} />
      )}
    </div>
  );
};

export default Asignaciones;
