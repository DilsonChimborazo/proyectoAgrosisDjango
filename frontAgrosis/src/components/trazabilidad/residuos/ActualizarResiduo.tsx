import { useState, useEffect } from "react";
import { useResiduos } from "../../../hooks/trazabilidad/residuo/useResiduos";
import { useResiduoPorId } from "../../../hooks/trazabilidad/residuo/useResiduoPorId";
import { useActualizarResiduo } from "../../../hooks/trazabilidad/residuo/useActualizarResiduo";
import Formulario from "../../globales/Formulario";
import { showToast } from '@/components/globales/Toast';

interface ActualizarResiduo {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarResiduo = ({ id, onSuccess }: ActualizarResiduo) => {
  const { data: residuo, isLoading, error } = useResiduoPorId(String(id));
  const { data: todos = [] } = useResiduos();
  const actualizarResiduo = useActualizarResiduo();

  const [formData, setFormData] = useState<Record<string, string>>({
    nombre: "",
    fecha: "",
    descripcion: "",
    fk_id_cultivo: "",
    fk_id_tipo_residuo: "",
  });

  useEffect(() => {
    if (residuo) {
      setFormData({
        nombre: residuo.nombre || "",
        fecha: residuo.fecha?.toString().slice(0, 10) || "",
        descripcion: residuo.descripcion || "",
        fk_id_cultivo: residuo.fk_id_cultivo?.id
          ? String(residuo.fk_id_cultivo.id)
          : "",
        fk_id_tipo_residuo: residuo.fk_id_tipo_residuo?.id
          ? String(residuo.fk_id_tipo_residuo.id)
          : "",
      });
    }
  }, [residuo]);

  const cultivosUnicos = Array.from(
    new Map(todos.map((r) => [r.fk_id_cultivo.id, r.fk_id_cultivo])).values()
  );
  const tiposUnicos = Array.from(
    new Map(todos.map((r) => [r.fk_id_tipo_residuo.id, r.fk_id_tipo_residuo])).values()
  );

  const opcionesCultivos = cultivosUnicos.map((c) => ({
    value: String(c.id),
    label: c.nombre_cultivo,
  }));
  const opcionesTipos = tiposUnicos.map((t) => ({
    value: String(t.id),
    label: t.nombre,
  }));

  const handleSubmit = (formData: { [key: string]: string | File | string[] }) => {
    // Función auxiliar para obtener valores como string
    const getStringValue = (value: string | string[] | File): string => {
      if (Array.isArray(value)) return value[0] || "";
      if (value instanceof File) return ""; // No se usa directamente como string
      return value || "";
    };

    // Convertir formData a un objeto de strings
    const formDataAsStrings = {
      nombre: getStringValue(formData.nombre),
      fecha: getStringValue(formData.fecha),
      descripcion: getStringValue(formData.descripcion),
      fk_id_cultivo: getStringValue(formData.fk_id_cultivo),
      fk_id_tipo_residuo: getStringValue(formData.fk_id_tipo_residuo),
    };

    // Validaciones
    if (!formDataAsStrings.fecha || !formDataAsStrings.fk_id_cultivo || !formDataAsStrings.fk_id_tipo_residuo) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    actualizarResiduo.mutate(
      {
        id: Number(id),
        nombre: formDataAsStrings.nombre,
        fecha: formDataAsStrings.fecha,
        descripcion: formDataAsStrings.descripcion,
        fk_id_cultivo: formDataAsStrings.fk_id_cultivo ? Number(formDataAsStrings.fk_id_cultivo) : null,
        fk_id_tipo_residuo: formDataAsStrings.fk_id_tipo_residuo ? Number(formDataAsStrings.fk_id_tipo_residuo) : null,
      },
      {
        onSuccess: () => {
          showToast({
            title: 'Éxito',
            description: 'Residuo actualizado exitosamente',
            variant: 'success',
          });
          onSuccess();
        },
        onError: (err) => {
          showToast({
            title: 'Error',
            description: 'No se pudo actualizar el residuo',
            variant: 'error',
          });err
        },
      }
    );
  };

  if (isLoading) return <p>Cargando datos…</p>;
  if (error) return <p className="text-red-500">Error al cargar residuo</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        title="Actualizar Residuo"
        initialValues={formData}
        key={JSON.stringify(formData)}
        onSubmit={handleSubmit}
        isError={actualizarResiduo.isError}
        isSuccess={actualizarResiduo.isSuccess}
        fields={[
          { id: "nombre", label: "Nombre del Residuo", type: "text" },
          { id: "fecha", label: "Fecha", type: "date" },
          { id: "descripcion", label: "Descripción", type: "text" },
          {
            id: "fk_id_cultivo",
            label: "Cultivo Asociado",
            type: "select",
            options: opcionesCultivos,
          },
          {
            id: "fk_id_tipo_residuo",
            label: "Tipo de Residuo",
            type: "select",
            options: opcionesTipos,
          },
        ]}
      />
    </div>
  );
};

export default ActualizarResiduo;