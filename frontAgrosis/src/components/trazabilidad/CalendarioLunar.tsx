import { useState } from 'react';
import { useCalendarioLunar } from '../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import Button from '../globales/Button';
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
      acciones: (
        <button 
            className="bg-blue-500 text-white px-3 py-1 rounded" 
            onClick={() => navigate(`/actualizarCalendarioLunar/${evento.id_calendario_lunar}`)}
        >
            Editar
        </button>
    ),
  })) : [];

  const headers = ['ID Calendario Lunar', 'Fecha', 'Descripción', 'Evento'];

  return (
    <div className="mx-auto p-4">
      <Button text="Crear Calendario Lunar" className='mx-2' onClick={() => navigate("/CrearCalendarioLunar") } variant="success" />
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
