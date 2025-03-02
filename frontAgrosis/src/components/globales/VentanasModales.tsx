import React from 'react';

// Definir un tipo de contenido genérico para el modal
interface VentanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contenido: any; // Puede ser cualquier tipo de dato, pero será más seguro definirlo con tipos específicos
  tipo: 'usuario' | 'asignacion'; // Diferenciar el tipo de contenido
}

const VentanaModal: React.FC<VentanaModalProps> = ({ isOpen, onClose, contenido, tipo }) => {
  if (!isOpen) return null; // Si no está abierto, no renderizar nada

  const renderContenido = () => {
    switch (tipo) {
      case 'usuario':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detalles del Usuario</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>ID:</strong> {contenido.id}</p>
              <p><strong>Nombre:</strong> {contenido.nombre}</p>
              <p><strong>Apellido:</strong> {contenido.apellido}</p>
              <p><strong>Correo Electrónico:</strong> {contenido.email}</p>
              <p><strong>Rol:</strong> {contenido.fk_id_rol?.rol}</p>
            </div>
          </>
        );
      case 'asignacion':
        return (
          <>
            <h2 className="text-2xl font-semibold mb-4 text-gray-800">Detalles de Asignación</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Actividad:</strong> {contenido.fk_id_actividad?.nombre_actividad}</p>
              <p><strong>Usuario:</strong> {`${contenido.id_identificacion?.nombre} ${contenido.id_identificacion?.apellido}`}</p>
              <p><strong>Fecha:</strong> {new Date(contenido.fecha).toLocaleDateString('es-ES')}</p>
              <p><strong>Observaciones:</strong> {contenido.observaciones}</p>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-70 flex justify-center items-start z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
        {renderContenido()}
        <button 
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default VentanaModal;
