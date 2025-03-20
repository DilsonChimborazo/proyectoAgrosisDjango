import { useState } from 'react';
import { useCalendarioLunar } from '../../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Button from '../../globales/Button';
import { useNavigate } from 'react-router-dom';

const CalendarioLunar = () => {
  const { data: eventos, error, isLoading } = useCalendarioLunar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvento, setSelectedEvento] = useState<any>(null);

  // Función para abrir el modal con un evento seleccionado
  const openModal = (evento: any) => {
    setSelectedEvento(evento);
    setIsModalOpen(true);
  };

    const navigate=useNavigate()

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEvento(null);
  };
  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/actualizarCalendarioLunar/${residuo.id}`);
  };


  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Verificar que 'eventos' es un arreglo antes de mapear
  const tablaData = Array.isArray(eventos) ? eventos.map((evento) => ({
    id: evento.id,
    fecha: evento.fecha,
    descripcion_evento: evento.descripcion_evento || 'N/A',
    evento: evento.evento,
  })) : [];

  const headers = ['ID Calendario Lunar', 'Fecha', 'Descripción', 'Evento'];

  return (
    <div className="mx-auto p-4">
      <Button text="Crear Calendario Lunar" className='mx-2' onClick={() => navigate("/CrearCalendarioLunar") } variant="green" />
      <Tabla
        title="Calendario Lunar"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
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
