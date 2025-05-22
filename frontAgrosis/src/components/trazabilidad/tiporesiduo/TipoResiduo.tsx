import { useCrearTipoResiduos } from '@/hooks/trazabilidad/tipoResiduo/useCrearTipoResiduo';
import Formulario from '@/components/globales/Formulario';
import { showToast } from '@/components/globales/Toast';

const TipoResiduos = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useCrearTipoResiduos();

  const formFields = [
    { id: 'nombre', label: 'Nombre del Tipo de Residuo', type: 'text', required: true },
    { id: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
  ];

  const handleSubmit = (formData: any) => {
    if (!formData.nombre || !formData.descripcion) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    const nuevoTipoResiduo = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };

    mutation.mutate(nuevoTipoResiduo, {
      onSuccess: () => {
        showToast({
          title: 'Éxito',
          description: 'Tipo de residuo creado exitosamente',
          variant: 'success',
        });
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        showToast({
          title: 'Error',
          description: 'No se pudo crear el tipo de residuo',
          variant: 'error',
        });error
      },
    });
  };

  return (
    <div className="container">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Tipo de Residuo"
      />
    </div>
  );
};

export default TipoResiduos;