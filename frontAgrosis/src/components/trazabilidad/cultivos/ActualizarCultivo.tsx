import { useState, useEffect } from "react";
import { useCultivoPorId } from "../../../hooks/trazabilidad/cultivo/useCultivoPorId";
import { useCultivo } from "../../../hooks/trazabilidad/cultivo/useCultivo";
import { useActualizarCultivo } from "./../../../hooks/trazabilidad/cultivo/useActualizarCultivo";
import Formulario from "../../globales/Formulario";
import { showToast } from '@/components/globales/Toast';

interface ActualizarCultivo {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarCultivo = ({ id, onSuccess }: ActualizarCultivo) => {
  const { data: cultivo, isLoading, error } = useCultivoPorId(String(id));
  const { data: todos = [] } = useCultivo();
  const actualizarCultivo = useActualizarCultivo();

  const [formData, setFormData] = useState<Record<string, string>>({
    nombre_cultivo: "",
    descripcion: "",
    fk_id_especie: "",
  });

  useEffect(() => {
    if (cultivo) {
      setFormData({
        nombre_cultivo: cultivo.nombre_cultivo || "",
        descripcion: cultivo.descripcion || "",
        fk_id_especie: String(cultivo.fk_id_especie?.id ?? ""),
      });
    }
  }, [cultivo]);

  const especiesUnicas = Array.from(
    new Map(todos.map((c) => [c.fk_id_especie.id, c.fk_id_especie])).values()
  );

  const opcionesEspecies = especiesUnicas.map((e) => ({
    value: String(e.id),
    label: e.nombre_comun,
  }));

  const handleSubmit = (formData: { [key: string]: string | File }) => {
    // Convertimos los valores a string, ya que este formulario solo tiene campos de texto o select
    const formDataAsStrings = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value : ''])
    ) as { [key: string]: string };

    if (!formDataAsStrings.nombre_cultivo || !formDataAsStrings.descripcion || !formDataAsStrings.fk_id_especie) {
      showToast({
        title: 'Error',
        description: 'Todos los campos son obligatorios',
        variant: 'error',
      });
      return;
    }

    const idEspecie = parseInt(formDataAsStrings.fk_id_especie, 10);
    if (isNaN(idEspecie) || formDataAsStrings.fk_id_especie === '') {
      showToast({
        title: 'Error',
        description: 'Debes seleccionar una especie válida',
        variant: 'error',
      });
      return;
    }

    actualizarCultivo.mutate(
      {
        id: +id,
        nombre_cultivo: formDataAsStrings.nombre_cultivo,
        descripcion: formDataAsStrings.descripcion,
        fk_id_especie: idEspecie,
      },
      {
        onSuccess: () => {
          showToast({
            title: 'Éxito',
            description: 'Cultivo actualizado exitosamente',
            variant: 'success',
          });
          onSuccess();
        },
        onError: (err) => {
          showToast({
            title: 'Error',
            description: 'No se pudo actualizar el cultivo',
            variant: 'error',
          });err
        },
      }
    );
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) {
    showToast({
      title: 'Error',
      description: 'Error al cargar el cultivo',
      variant: 'error',
    });
    return <p className="text-red-500">Error al cargar cultivo</p>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        title="Actualizar Cultivo"
        initialValues={formData}
        key={JSON.stringify(formData)}
        onSubmit={handleSubmit}
        isError={actualizarCultivo.isError}
        isSuccess={actualizarCultivo.isSuccess}
        fields={[
          { id: "nombre_cultivo", label: "Nombre del Cultivo", type: "text" },
          { id: "descripcion", label: "Descripción", type: "text" },
          {
            id: "fk_id_especie",
            label: "Especie",
            type: "select",
            options: opcionesEspecies,
          },
        ]}
      />
    </div>
  );
};

export default ActualizarCultivo;