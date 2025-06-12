import { Pea, useCrearPea } from '../../../hooks/trazabilidad/pea/useCrearPea';
import Formulario from '../../globales/Formulario';
import { showToast } from '@/components/globales/Toast';

interface CrearPea {
  onSuccess: () => void;
}

const CrearPea = ({ onSuccess }: CrearPea) => {
  const mutation = useCrearPea();

  const formFields = [
    { id: 'nombre_pea', label: 'Nombre del PEA', type: 'text' },
    { id: 'descripcion', label: 'Descripción', type: 'text' },
    {
      id: 'tipo_pea',
      label: 'Tipo de PEA',
      type: 'select',
      options: [
        { value: 'Plaga', label: 'Plaga' },
        { value: 'Enfermedad', label: 'Enfermedad' },
        { value: 'Arvense', label: 'Arvense' },
      ],
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
    const errors: string[] = [];

    // Convertir valores a string donde sea necesario
    const getStringValue = (value: string | string[] | File): string => {
      if (Array.isArray(value)) {
        return value[0] || "";
      }
      if (value instanceof File) {
        errors.push("Archivos no son soportados en este formulario");
        return "";
      }
      return value;
    };

    const nombre_pea = getStringValue(formData.nombre_pea);
    const descripcion = getStringValue(formData.descripcion);
    const tipo_pea = getStringValue(formData.tipo_pea);

    // Validaciones
    if (!nombre_pea?.trim()) errors.push("El nombre del PEA es obligatorio");
    if (!tipo_pea) errors.push("El tipo de PEA es obligatorio");

    if (errors.length > 0) {
      showToast({
        title: "Error al crear PEA",
        description: errors.join(", "),
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    const nuevoPea: Pea = {
      nombre_pea,
      descripcion,
      tipo_pea,
    };

    mutation.mutate(nuevoPea, {
      onSuccess: () => {
        showToast({
          title: "PEA creado exitosamente",
          description: "El PEA ha sido registrado en el sistema.",
          timeout: 4000,
          variant: "success",
        });
        onSuccess();
      },
      onError: () => {
        showToast({
          title: "Error al crear PEA",
          description: "Los datos enviados son inválidos o incompletos. Por favor, revisa el formulario.",
          timeout: 5000,
          variant: "error",
        });
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
        title="Registrar Nuevo PEA"
      />
    </div>
  );
};

export default CrearPea;