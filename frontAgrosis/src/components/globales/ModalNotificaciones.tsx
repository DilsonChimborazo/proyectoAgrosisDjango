import { useEffect, useRef } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface NotificacionData {
  id: number;
  titulo: string;
  mensaje: string;
  fecha: string;
  estado: string;
  leida: boolean;
}

interface VentanaModalNotificacionesProps {
  isOpen: boolean;
  onClose: () => void;
  columns: { name: string; key: string }[];
  data: NotificacionData[];
  onSuccess: (row: NotificacionData) => void;
}

const VentanaModalNotificaciones: React.FC<VentanaModalNotificacionesProps> = ({
  isOpen,
  onClose,
  
  data,
  onSuccess,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Cerrar modal al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-12 right-4 z-50 w-[28rem] bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out transform translate-y-0 opacity-100">
      <div ref={modalRef} className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-900">Notificaciones</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <XMarkIcon className="w-6 h-6" />
          </button>
        </div>

        {data.length === 0 ? (
          <p className="text-gray-500 text-center py-6 text-base">No hay notificaciones</p>
        ) : (
          <div className="max-h-96 overflow-y-auto rounded-lg">
            <div className="space-y-2">
              {data.map((row) => (
                <div
                  key={row.id}
                  className={`flex items-start p-4 rounded-lg transition-colors duration-200 cursor-pointer ${
                    row.leida ? 'bg-white' : 'bg-green-50'
                  } hover:bg-gray-50 border border-gray-100`}
                  onClick={() => !row.leida && onSuccess(row)}
                >
                  {!row.leida && (
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3 mt-1.5"></div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-semibold text-gray-900">{row.titulo}</h3>
                      <span className="text-xs text-gray-500">{row.fecha}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{row.mensaje}</p>
                    <p className="text-xs text-gray-500 mt-1">{row.estado}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VentanaModalNotificaciones;