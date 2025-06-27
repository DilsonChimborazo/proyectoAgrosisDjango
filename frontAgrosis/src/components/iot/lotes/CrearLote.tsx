import { Lotes } from "../../../hooks/iot/lote/useCrearLote";
import { useCrearLote } from "../../../hooks/iot/lote/useCrearLote";
import Formulario from "../../globales/Formulario";
import { showToast } from '@/components/globales/Toast';

interface CrearLoteProps {
  onSuccess?: () => void;
}

const CrearLote = ({ onSuccess }: CrearLoteProps) => {
  const mutation = useCrearLote();

  const formFields = [
    { id: "dimencion", label: "Dimensión", type: "number", required: true },
    { id: "nombre_lote", label: "Nombre del Lote", type: "text", required: true },
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
      required: true,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
    // Validar que los campos necesarios sean strings y no estén vacíos
    if (
      typeof formData.dimencion !== "string" ||
      typeof formData.nombre_lote !== "string" ||
      typeof formData.estado !== "string" ||
      !formData.dimencion ||
      !formData.nombre_lote ||
      !formData.estado
    ) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios y deben ser válidos',
        variant: 'error',
      });
      return;
    }

    const nuevoLote: Lotes = {
      id: 0,
      dimencion: Number(formData.dimencion),
      nombre_lote: formData.nombre_lote,
      estado: formData.estado === "true",
    };

    mutation.mutate(nuevoLote, {
      onSuccess: () => {
        showToast({
          title: 'Éxito',
          description: 'Lote creado exitosamente',
          variant: 'success',
        });
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        showToast({
          title: 'Error',
          description: 'No se pudo crear el lote',
          variant: 'error',
        });error
      },
    });
  };

  return (
    <div className="p-10">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Crear Lote"
      />
    </div>
  );
};

export default CrearLote;