import React from 'react';

interface VentanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contenido: Record<string, any>;
  titulo: string;
}

const VentanaModal: React.FC<VentanaModalProps> = ({ isOpen, onClose, contenido, titulo }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-70 flex justify-center items-start z-50">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{titulo}</h2>
        <div className="space-y-2 text-gray-700">
          {Object.entries(contenido).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {String(value)}
            </p>
          ))}
        </div>
        <button
          className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default VentanaModal;
