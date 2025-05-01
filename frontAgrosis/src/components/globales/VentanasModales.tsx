import React from 'react';
import { X } from "lucide-react";
import Tabla from '@/components/globales/Tabla';

interface Column {
  name: string;
  key: string;
}

interface VentanaModalProps {
  isOpen: boolean;
  onClose: () => void;
  titulo: string;
  children?: React.ReactNode;
  contenido?: React.ReactNode; 
  data?: any[];
  columns?: Column[];
  variant?: 'content' | 'table';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const VentanaModal: React.FC<VentanaModalProps> = ({
  isOpen,
  onClose,
  titulo,
  children,
  contenido,
  data = [],
  columns = [],
  variant = 'content',
  size = 'md',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-1/4 min-w-[300px]',
    md: 'w-1/3 min-w-[400px]',
    lg: 'w-1/2 min-w-[500px]',
    xl: 'w-3/4 min-w-[600px]'
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-70 flex justify-center items-start pt-20 overflow-auto p-4">
      <div className={`relative bg-white p-8 rounded-xl shadow-lg ${sizeClasses[size]} max-w-[90vw] max-h-[90vh] overflow-auto`}>
        <button
          className="absolute top-2 right-2 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition duration-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">{titulo}</h2>

        {variant === 'table' ? (
          data.length > 0 ? (
            <Tabla
              title={titulo}
              headers={columns.map(c => c.name)}
              data={data}
              onClickAction={(row) => console.log('Detalle:', row)}
              onUpdate={(row) => console.log('Actualizar:', row)}
              onCreate={() => console.log('Crear nuevo')}
            />
          ) : (
            <p className="text-gray-500">No hay datos disponibles</p>
          )
        ) : (
          contenido || children
        )}
      </div>
    </div>
  );
};

export default VentanaModal;