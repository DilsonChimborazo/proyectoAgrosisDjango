import { useCreateRol } from '@/hooks/usuarios/rol/useCreateRol';  
import { Rol } from '@/hooks/usuarios/rol/useRol';  
import Formulario from '@/components/globales/Formulario';
import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query';
import { showToast } from '@/components/globales/Toast';


interface CrearRolProps {
  onClose: () => void;
  onCreated?: (options?: RefetchOptions) => Promise<QueryObserverResult>;
}

const CrearRol: React.FC<CrearRolProps> = ({ onClose, onCreated }) => {
  const mutation = useCreateRol();


  const formFields = [
    { id: 'rol', label: 'Rol', type: 'text' },
    { id: 'fecha_creacion', label: 'Fecha de creacion', type: 'date' }
  ];

  const handleSubmit = (formData: { [key: string]: any }) => {
    const { rol, fecha_creacion } = formData;

    if (!rol || !fecha_creacion) {
      showToast({
          title: 'Campos Incompletos',
          description: "",
          variant: 'error',
        });
    }

    const newRol: Rol = {
      rol,
      fecha_creacion
    };

    mutation.mutate(newRol, {
      onSuccess: () => {
        showToast({
          title: 'Rol creado',
          description: `El rol "${rol}" fue creado con éxito.`,
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
        title="Crear Nuevo Rol"
      />
    </div>
  );
};

export default CrearRol;
