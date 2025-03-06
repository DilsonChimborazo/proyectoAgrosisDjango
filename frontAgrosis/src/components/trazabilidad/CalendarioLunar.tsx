import { useState } from 'react';
import { useCalendarioLunar } from '../../hooks/trazabilidad/useCalendarioLunar';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';

const CalendarioLunar = () => {
  const { data: eventos, error, isLoading } = useCalendarioLunar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  // Función para abrir el modal con un evento seleccionado
  const openModal = (evento: any) => {
    setSelectedEvento(evento);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvento(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Verificar que 'eventos' es un arreglo antes de mapear
  const tablaData = Array.isArray(eventos) ? eventos.map((evento) => ({
    id: evento.id_calendario_lunar,
    fecha: evento.fecha,
    descripcion: evento.descripcion || 'N/A',
    evento: evento.evento,
  })) : [];

  const headers = ['ID Calendario Lunar', 'Fecha', 'Descripción', 'Evento'];

  return (
    <div className="mx-auto p-4">
      <Tabla
        title="Calendario Lunar"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
      />

      {selectedEvento && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Calendario Lunar"
          contenido={selectedEvento}
        />
      )}
    </div>
  );
};

export default CalendarioLunar;
