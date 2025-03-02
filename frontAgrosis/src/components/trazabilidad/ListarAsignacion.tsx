import { useState } from 'react';
import { useAsignacion } from '../../hooks/trazabilidad/useAsignacion';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';

const Asignaciones = () => {
  const { data: asignaciones, error, isLoading } = useAsignacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAsignacion, setSelectedAsignacion] = useState<any>(null);

  // Función para abrir el modal con una asignación seleccionada
  const openModal = (asignacion: any) => {
    setSelectedAsignacion(asignacion);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsignacion(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const tablaData = (asignaciones ?? []).map((asignacion) => ({
    id: asignacion.id,
    fecha: new Date(asignacion.fecha).toLocaleDateString('es-ES'),
    observaciones: asignacion.observaciones,
    nombre_actividad: asignacion.fk_id_actividad.nombre_actividad,
    usuario: `${asignacion.id_identificacion.nombre} ${asignacion.id_identificacion.apellido}`,
  }));

  const headers = ['ID', 'Fecha', 'Observaciones', 'Actividad', 'Usuario'];

  return (
    <div className=" mx-auto p-4">  
      <Tabla
        title="Lista de Asignaciones"
        headers={headers}
        data={tablaData} // Los datos transformados
        onClickAction={openModal} // Función para manejar el clic
      />
      
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        contenido={selectedAsignacion} // Pasar la asignación seleccionada
        tipo="asignacion" // El tipo de modal
      />
    </div>
  );
};

export default Asignaciones;
