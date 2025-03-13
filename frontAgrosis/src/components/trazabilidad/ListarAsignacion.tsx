
import { useState } from 'react';
import { useAsignacion } from '../../hooks/trazabilidad/useAsignacion';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import Button from '../globales/Button';
import { useNavigate } from 'react-router-dom';




const Asignaciones = () => {
  const { data: asignaciones, error, isLoading } = useAsignacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<any>(null);

  // Función para abrir el modal con una asignación seleccionada
  const openModal = (asignacion: any) => {
    setSelectedAsignacion(asignacion);
    setIsModalOpen(true);
  };

  const navigate = useNavigate();
  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsignacion(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de datos para la tabla
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
    <div className="mx-auto p-4">


      <Tabla title="Lista de Asignaciones" headers={headers} data={tablaData} onClickAction={openModal} />

      <Button text="Crear Asignacion" className='mx-2' onClick={() => navigate("/CrearAsignacion") } variant="success" />
      <Tabla
        title="Lista de Asignaciones"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
      />


      {selectedAsignacion && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles de la Asignación" contenido={selectedAsignacion} />
      )}
    </div>
  );
};

export default Asignaciones;
