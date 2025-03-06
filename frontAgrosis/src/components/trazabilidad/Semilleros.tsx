import { useState } from 'react';
import { useSemilleros } from '../../hooks/trazabilidad/useSemilleros';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';

const Semillero = () => {
  const { data: semillas, error, isLoading } = useSemilleros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemilla, setSelectedSemilla] = useState<any>(null);

  // Función para abrir el modal con una semilla seleccionada
  const openModal = (semilla: any) => {
    setSelectedSemilla(semilla);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSemilla(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Verificar que 'semillas' es un arreglo antes de mapear
  const tablaData = Array.isArray(semillas) ? semillas.map((semilla) => ({
    id_semillero: semilla.id_semillero,
    nombre_semilla: semilla.nombre_semilla,
    fecha_siembra: semilla.fecha_siembra,
    fecha_estimada: semilla.fecha_estimada,
    cantidad: semilla.cantidad,
  })) : [];

  const headers = ['ID Semillero', 'Nombre Semilla', 'Fecha de Siembra', 'Fecha Estimada', 'Cantidad'];

  return (
    <div className="mx-auto p-4">
      <Tabla
        title="Lista de Semilleros"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
      />

      {selectedSemilla && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Semillero"
          contenido={selectedSemilla}
        />
      )}
    </div>
  );
};

export default Semillero;
