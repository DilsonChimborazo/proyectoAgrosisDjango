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
  size?: 'sm' | 'md' | 'lg' | '1.5xl' | 'xl' | 'venta'; // Añadimos tamaño especial para venta
  onSuccess?: (nuevo: any) => void; 
  modalClassName?: string; // Nueva prop para clases personalizadas
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
  onSuccess,
  modalClassName = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-full md:w-1/4 min-w-[300px]',
    md: 'w-full md:w-1/3 min-w-[400px]',
    '1.5xl': 'w-full max-w-[960px]', // Nuevo tamaño intermedio (~960px)
    lg: 'w-full md:w-1/2 min-w-[500px]',
    xl: 'w-full md:w-3/4 min-w-[600px]',
    venta: 'w-full md:w-[90%] lg:w-[85%] xl:w-[80%] min-w-[300px] max-w-[1200px]' // Tamaño especial para venta
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-500 bg-opacity-70 flex justify-center items-start pt-10 md:pt-20 overflow-auto p-2 md:p-4">
      <div className={`relative bg-white p-4 md:p-6 lg:p-8 rounded-lg md:rounded-xl shadow-lg ${sizeClasses[size]} max-w-[95vw] max-h-[90vh] overflow-auto ${modalClassName}`}>
        <button
          className="absolute top-2 right-2 hover:bg-gray-200 rounded-full w-8 h-8 flex items-center justify-center shadow-md transition duration-200"
          onClick={onClose}
        >
          <X size={20} />
        </button>
        <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-gray-800">{titulo}</h2>

        <div className="overflow-auto max-h-[calc(90vh-100px)]">
          {variant === 'table' ? (
            data.length > 0 ? (
              <Tabla
                title={titulo}
                headers={columns.map(c => c.name)}
                data={data}
                onClickAction={(row) => console.log('Detalle:', row)}
                onUpdate={(row) => {
                  console.log('Actualizar:', row);
                  if (onSuccess) onSuccess(row); 
                }}
                onCreate={() => {
                  console.log('Crear nuevo');
                  if (onSuccess) onSuccess({}); 
                }}
              />
            ) : (
              <p className="text-gray-500">No hay datos disponibles</p>
            )
          ) : (
            contenido || children
          )}
        </div>
      </div>
    </div>
  );
};

export default VentanaModal;