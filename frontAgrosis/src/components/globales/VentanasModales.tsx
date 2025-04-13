import React from 'react';
import { X } from "lucide-react";

interface VentanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  contenido: React.ReactNode | Record<string, any>;
  titulo: string;
}

const VentanaModal: React.FC<VentanaModalProps> = ({ isOpen, onClose, contenido, titulo }) => {
  if (!isOpen) return null;

  const renderContenido = () => {
    if (React.isValidElement(contenido)) {
      return contenido;
    }

    if (typeof contenido === 'object' && contenido !== null) {
      return (
        <div className="space-y-2 text-gray-700">
          {Object.entries(contenido).map(([key, value]) => (
            <p key={key}>
              <strong>{key.replace(/_/g, ' ').toUpperCase()}:</strong> {String(value)}
            </p>
          ))}
        </div>
      );
    }

    return <p className="text-gray-700">Contenido no válido</p>;
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-70 flex justify-center items-start pt-20 overflow-auto">
      <div className="relative bg-white p-8 rounded-xl shadow-lg w-96 max-w-lg">
        <button
          className="absolute top-2 right-2 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition duration-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{titulo}</h2>
        {renderContenido()}
      </div>
    </div>
  );
};

export default VentanaModal;
