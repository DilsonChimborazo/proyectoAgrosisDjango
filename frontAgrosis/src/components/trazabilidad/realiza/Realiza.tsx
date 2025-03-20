import { useState } from 'react';
import { useRealiza } from '../../../hooks/trazabilidad/realiza/useRealiza';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';

const Realiza = () => {
  const { data: realiza, error, isLoading } = useRealiza();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRealiza, setSelectedRealiza] = useState<any>(null);

  // Función para abrir el modal con un registro de realiza seleccionado
  const openModal = (realiza: any) => {
    setSelectedRealiza(realiza);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRealiza(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de datos para la tabla
  const tablaData = (realiza ?? []).map((item) => ({
    id: item.id,
    cultivo: item.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
    actividad: item.fk_id_actividad?.nombre_actividad || 'Sin actividad',
  }));

  const headers = ['ID', 'Cultivo', 'Actividad'];

  return (
    <div className="mx-auto p-4">
      <Tabla
        title="Lista de Realiza"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
      />

      {selectedRealiza && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Realiza"
          contenido={selectedRealiza}
        />
      )}
    </div>
  );
};

export default Realiza;
