import { Lotes } from "../../../hooks/iot/lote/useCrearLote";
import { useCrearLote } from "../../../hooks/iot/lote/useCrearLote";
import Formulario from "../../globales/Formulario";

interface CrearLoteProps {
  onSuccess?: () => void;
}

const CrearLote = ({ onSuccess }: CrearLoteProps) => {
  const mutation = useCrearLote();

  const formFields = [
    { id: "dimencion", label: "Dimensión", type: "number" },
    { id: "nombre_lote", label: "Nombre del Lote", type: "text" },
    {
      id: "estado",
      label: "Estado",
      type: "select",
      options: [
        { value: "true", label: "Activo" },
        { value: "false", label: "Inactivo" },
      ],
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.dimencion || !formData.nombre_lote || !formData.estado) {
      console.log("Campos faltantes");
      return;
    }

    const nuevoLote: Lotes = {
      id: 0,
      dimencion: Number(formData.dimencion),
      nombre_lote: formData.nombre_lote,
      estado: formData.estado === "true", // Convertir string a boolean
    };

    mutation.mutate(nuevoLote, {
      onSuccess: () => {
        console.log("✅ Lote creado correctamente");
        if (onSuccess) onSuccess();
      },
      onError: (error) => {
        console.error("❌ Error al crear el lote:", error);
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