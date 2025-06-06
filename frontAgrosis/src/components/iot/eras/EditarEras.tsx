import { useState, useEffect } from "react";
import { useEditarEras } from "@/hooks/iot/eras/useEditarEras";
import { useEraPorId } from "@/hooks/iot/eras/useEraPorId";
import { useLotes } from "@/hooks/iot/lote/useLotes";
import Formulario from "../../globales/Formulario";
import { showToast } from "@/components/globales/Toast";

interface EditarErasProps {
  id: string;
  onSuccess?: () => void;
}

const EditarEras = ({ id, onSuccess }: EditarErasProps) => {
  const { data: eras, isLoading, error } = useEraPorId(id);
  const { data: lotes = [] } = useLotes();
  const actualizarEra = useEditarEras();

  const [formData, setFormData] = useState({
    fk_id_lote: "",
    nombre: "",
    descripcion: "",
    estado: "",
  });

  useEffect(() => {
    if (eras) {
      console.log("🔄 Datos de la Era recibidos:", eras);
      const fkIdLote = eras.fk_id_lote?.id ? eras.fk_id_lote.id.toString() : "";
      setFormData({
        fk_id_lote: fkIdLote,
        nombre: eras.nombre || "",
        descripcion: eras.descripcion || "",
        estado: eras.estado ? "true" : "false",
      });
      console.log("📋 FormData actualizado:", {
        fk_id_lote: fkIdLote,
        nombre: eras.nombre || "",
        descripcion: eras.descripcion || "",
        estado: eras.estado ? "true" : "false",
      });
    }
  }, [eras]);

  useEffect(() => {
    console.log("📦 Lotes disponibles:", lotes);
  }, [lotes]);

  useEffect(() => {
    if (error) {
      showToast({
        title: "Error al cargar era",
        description: "No se pudo cargar la información de la era",
        timeout: 5000,
        variant: "error",
      });
    }
  }, [error]);

  const handleSubmit = (data: { [key: string]: string | File }) => {
    if (!id) return;

    // Validaciones locales
    const errors: string[] = [];
    if (!data.fk_id_lote || typeof data.fk_id_lote !== "string") errors.push("Lote es obligatorio");
    if (!data.nombre || typeof data.nombre !== "string") errors.push("Nombre es obligatorio");
    if (!data.descripcion || typeof data.descripcion !== "string") errors.push("Descripción es obligatoria");
    if (!data.estado || typeof data.estado !== "string") errors.push("Estado es obligatorio");

    if (errors.length > 0) {
      showToast({
        title: "Error al actualizar era",
        description: errors.join(", "),
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    const eraActualizada = {
      id: Number(id),
      fk_id_lote: Number(data.fk_id_lote) || 0,
      nombre: (data.nombre as string).trim(),
      descripcion: (data.descripcion as string).trim(),
      estado: (data.estado as string) === "true",
    };

    console.log("🚀 Enviando Era actualizada:", eraActualizada);

    actualizarEra.mutate(eraActualizada, {
      onSuccess: () => {
        console.log("✅ Era actualizada correctamente");
        showToast({
          title: "Éxito",
          description: "Era actualizada exitosamente",
          timeout: 4000,
          variant: "success",
        });
        if (onSuccess) onSuccess();
      },
      onError: (error: any) => {
        console.error("❌ Error al intentar actualizar la Era:", error);
        let errorMessage = "Error al actualizar la era. Intenta de nuevo.";
        if (error.response?.status === 401) {
          errorMessage = "No estás autorizado. Verifica tu token o permisos.";
        } else if (error.response?.data) {
          errorMessage = JSON.stringify(error.response.data);
        }
        showToast({
          title: "Error al actualizar era",
          description: errorMessage,
          timeout: 5000,
          variant: "error",
        });
      },
    });
  };

  if (isLoading) return <div className="text-gray-500">Cargando datos...</div>;
  if (error) return <div className="text-red-500">Error al cargar la Era</div>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={[
          {
            id: "fk_id_lote",
            label: "Lote",
            type: "select",
            options: lotes.map((lote) => ({
              value: lote.id.toString(),
              label: lote.nombre_lote,
            })),
          },
          { id: "nombre", label: "Nombre", type: "text" },
          { id: "descripcion", label: "Descripción", type: "text" },
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
        isError={actualizarEra.isError}
        isSuccess={actualizarEra.isSuccess}
        title="Actualizar Era"
        initialValues={formData}
        key={JSON.stringify(formData)}
      />
    </div>
  );
};

export default EditarEras;