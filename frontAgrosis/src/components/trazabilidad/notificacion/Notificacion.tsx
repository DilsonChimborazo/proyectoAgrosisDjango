import { useState } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { useNotificacion } from '@/hooks/trazabilidad/notificacion/useNotificacion';
import VentanaModalNotificaciones from '../../../components/globales/ModalNotificaciones';

const Notification: React.FC = () => {
  const { notificaciones, unreadCount, isLoading, error, markAsRead } = useNotificacion();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleMarkAsRead = (notificacion: any) => {
    if (notificacion.leida) {
      setMensaje('La notificación ya está marcada como leída');
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    markAsRead(notificacion.id);
    setMensaje('Notificación marcada como leída');
    setTimeout(() => setMensaje(null), 3000);
  };

  const columns = [
    { name: 'Título', key: 'titulo' },
    { name: 'Mensaje', key: 'mensaje' },
    { name: 'Fecha', key: 'fecha' },
    { name: 'Estado', key: 'estado' },
  ];

  const formattedData = notificaciones.map((notificacion) => ({
    id: notificacion.id,
    titulo: notificacion.titulo,
    mensaje: notificacion.mensaje,
    fecha: new Date(notificacion.fecha_notificacion).toLocaleString(),
    estado: notificacion.leida ? 'Leída' : 'No leída',
    leida: notificacion.leida,
  }));

  return (
    <div className="relative">
      {mensaje && (
        <div className="absolute top-10 right-0 p-2 bg-green-500 text-white text-sm rounded-md shadow-md z-50">
          {mensaje}
        </div>
      )}

      {isLoading && (
        <div className="absolute top-10 right-0 p-2 bg-gray-500 text-white text-sm rounded-md shadow-md z-50">
          Cargando notificaciones...
        </div>
      )}

      {error && (
        <div className="absolute top-10 right-0 p-2 bg-red-500 text-white text-sm rounded-md shadow-md z-50">
          Error: {error.message}
        </div>
      )}

      <button
        onClick={toggleModal}
        className="flex items-center justify-center w-8 h-8 bg-green-700 text-white rounded-full hover:bg-green-600 transition-all duration-300"
      >
        <BellIcon className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold text-white bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      <VentanaModalNotificaciones
        isOpen={isModalOpen}
        onClose={toggleModal}
        columns={columns}
        data={formattedData}
        onSuccess={(row) => handleMarkAsRead(row)}
      />
    </div>
  );
};

export default Notification;