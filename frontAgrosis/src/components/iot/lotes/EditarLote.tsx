import { useState, useEffect } from "react";
import { useEditarLote } from "@/hooks/iot/lote/useEditarLote";
import { useLotePorId } from "@/hooks/iot/lote/useLotePorId";
import Formulario from "../../globales/Formulario";
import { showToast } from "@/components/globales/Toast";

interface EditarLoteProps {
  id: string;
  onSuccess?: () => void;
}

const EditarLote = ({ id, onSuccess }: EditarLoteProps) => {
  const { data: lote, isLoading, error } = useLotePorId(id);
  const actualizarLote = useEditarLote();

  const [formData, setFormData] = useState({
    dimencion: "",
    nombre_lote: "",
    estado: "",
  });

  useEffect(() => {
    if (lote) {
      setFormData({
        dimencion: lote.dimencion ? lote.dimencion.toString() : "",
        nombre_lote: lote.nombre_lote || "",
        estado: lote.estado ? "true" : "false",
      });
    }
  }, [lote]);

  useEffect(() => {
    if (error) {
      showToast({
        title: "Error al cargar lote",
        description: "No se pudo cargar la información del lote",
        timeout: 5000,
        variant: "error",
      });
    }
  }, [error]);

  const handleSubmit = (data: { [key: string]: string | string[] | File }) => {
    if (!id) return;

    // Validaciones locales
    const errors: string[] = [];
    if (!data.dimencion || typeof data.dimencion !== "string" || isNaN(Number(data.dimencion)))
      errors.push("Dimensión es obligatoria y debe ser un número");
    if (!data.nombre_lote || typeof data.nombre_lote !== "string")
      errors.push("Nombre del Lote es obligatorio");
    if (!data.estado || typeof data.estado !== "string")
      errors.push("Estado es obligatorio");

    if (errors.length > 0) {
      showToast({
        title: "Error al actualizar lote",
        description: errors.join(", "),
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    const loteActualizado = {
      id: Number(id),
      dimencion: Number(data.dimencion) || 0,
      nombre_lote: (data.nombre_lote as string).trim(),
      estado: (data.estado as string) === "true",
    };

    actualizarLote.mutate(loteActualizado, {
      onSuccess: () => {
        showToast({
          title: "Éxito",
          description: "Lote actualizado exitosamente",
          timeout: 4000,
          variant: "success",
        });
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        let errorMessage = "Error al actualizar el lote. Intenta de nuevo.";
        if (error.response?.status === 401) {
          errorMessage = "No estás autorizado. Verifica tu token o permisos.";
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        }
        showToast({
          title: "Error al actualizar lote",
          description: errorMessage,
          timeout: 5000,
          variant: "error",
        });
      },
    });
  };

  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar el Lote</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={[
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
        ]}
        onSubmit={handleSubmit}
        isError={actualizarLote.isError}
        isSuccess={actualizarLote.isSuccess}
        title="Actualizar Lote"
        initialValues={formData}
        key={JSON.stringify(formData)}
      />
    </div>
  );
};

export default EditarLote;