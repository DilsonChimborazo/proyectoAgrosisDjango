import { useCrearTipoResiduos } from '@/hooks/trazabilidad/tipoResiduo/useCrearTipoResiduo';
import Formulario from '@/components/globales/Formulario';

const TipoResiduos = ({ onSuccess }: { onSuccess?: () => void }) => {
  const mutation = useCrearTipoResiduos();

  const formFields = [
    { id: 'nombre', label: 'Nombre del Tipo de Residuo', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'textarea' },
  ];

  const handleSubmit = (formData: any) => {
    const nuevoTipoResiduo = {
      nombre: formData.nombre,
      descripcion: formData.descripcion,
    };

    mutation.mutate(nuevoTipoResiduo, {
      onSuccess: () => {
        console.log('✅ Tipo de residuo creado exitosamente:', nuevoTipoResiduo);
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error('❌ Error al crear el tipo de residuo:', error);
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
      {mutation.isError && (
        <div className="text-red-500 mt-2">Hubo un error al crear el tipo de residuo. Intenta nuevamente.</div>
      )}
      {mutation.isSuccess && (
        <div className="text-green-500 mt-2">Tipo de residuo creado exitosamente!</div>
      )}
    </div>
  );
};

export default TipoResiduos;