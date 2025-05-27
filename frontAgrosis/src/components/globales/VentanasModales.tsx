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
  size?: 'sm' | 'md' | 'lg' | '1.5xl' | 'xl' | 'venta';
  onSuccess?: (nuevo: any) => void;
  modalClassName?: string;
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
  size = 'lg',
  onSuccess,
  modalClassName = '',
}) => {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: 'w-[90vw] max-w-[400px] sm:w-[80vw] md:w-[30vw] min-w-[280px]',
    md: 'w-[90vw] max-w-[500px] sm:w-[80vw] md:w-[40vw] min-w-[320px]',
    '1.5xl': 'w-[90vw] max-w-[960px] sm:w-[85vw] md:w-[70vw] lg:w-[60vw]',
    lg: 'w-[90vw] max-w-[600px] sm:w-[80vw] md:w-[50vw] min-w-[360px]',
    xl: 'w-[90vw] max-w-[800px] sm:w-[85vw] md:w-[70vw] lg:w-[65vw] min-w-[400px]',
    venta: 'w-[95vw] max-w-[1200px] sm:w-[90vw] md:w-[85vw] lg:w-[80vw] xl:w-[75vw] min-w-[300px]',
  };

  return (
    <div className="fixed mt-12 inset-0 z-50 bg-gray-500 bg-opacity-70 flex justify-center items-start pt-4 sm:pt-6 md:pt-8 lg:pt-10 overflow-y-auto p-2 sm:p-3 md:p-4">
      <div
        className={`
          relative bg-white rounded-lg shadow-lg
          ${sizeClasses[size]}
          max-h-[90vh] sm:max-h-[85vh]
          p-3 sm:p-4 md:p-6 lg:p-8
          overflow-y-auto
          ${modalClassName}
        `}
      >
        <button
          className="absolute top-2 right-2 sm:top-3 sm:right-3 p-2 rounded-full hover:bg-gray-200 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onClick={onClose}
          aria-label="Cerrar modal"
        >
          <X size={18} className="text-gray-600 sm:w-5 sm:h-5" />
        </button>
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold mb-2 sm:mb-3 md:mb-4 text-gray-800">
          {titulo}
        </h2>

        <div className="overflow-y-auto max-h-[calc(90vh-100px)] sm:max-h-[calc(85vh-120px)] md:max-h-[calc(85vh-140px)]">
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
              <p className="text-gray-500 text-sm sm:text-base text-center">
                No hay datos disponibles
              </p>
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