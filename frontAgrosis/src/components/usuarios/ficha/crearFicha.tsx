import { useCreateFicha } from '@/hooks/usuarios/ficha/useCreateFicha';
import { Ficha } from '@/hooks/usuarios/ficha/useFicha';
import Formulario from '@/components/globales/Formulario';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { showToast } from '@/components/globales/Toast';

interface CrearFichaProps {
  onClose: () => void;
  onCreated?: (options?: RefetchOptions) => Promise<QueryObserverResult>;
}

const CrearFicha: React.FC<CrearFichaProps> = ({ onClose, onCreated }) => {
  const mutation = useCreateFicha();

  const formFields = [
    { id: 'numero_ficha', label: 'Número de ficha', type: 'text' },
    { id: 'nombre_ficha', label: 'Nombre de la ficha', type: 'text' },
    { id: 'abreviacion', label: 'Abreviación', type: 'text' },
    { id: 'fecha_inicio', label: 'Fecha de inicio', type: 'date' },
    { id: 'fecha_salida', label: 'Fecha de salida', type: 'date' },
  ];

  const handleSubmit = (formData: { [key: string]: any }) => {
    const { numero_ficha, nombre_ficha, abreviacion, fecha_inicio, fecha_salida } = formData;

    if (!numero_ficha || !nombre_ficha || !abreviacion || !fecha_inicio || !fecha_salida) {
      showToast({
          title: 'Campos Incompletos',
          description: "",
          variant: 'error',
        });
    }

    const newFicha: Ficha = {
      numero_ficha,
      nombre_ficha,
      abreviacion,
      fecha_inicio,
      fecha_salida,
    };

    mutation.mutate(newFicha, {
      onSuccess: () => {
        showToast({
          title: 'Ficha creada',
          description: `El id ficha "${numero_ficha}" fue creado con éxito.`,
          variant: 'success',
        });
        onCreated?.();
        onClose(); 
      },
    });
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Nueva Ficha"
      />
    </div>
  );
};

export default CrearFicha;
