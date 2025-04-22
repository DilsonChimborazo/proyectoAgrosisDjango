import { useState, useEffect } from "react";
import { useCultivoPorId } from "../../../hooks/trazabilidad/cultivo/useCultivoPorId";
import { useCultivo } from "../../../hooks/trazabilidad/cultivo/useCultivo";
import { useActualizarCultivo } from "./../../../hooks/trazabilidad/cultivo/useActualizarCultivo";
import Formulario from "../../globales/Formulario";

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
    fecha_plantacion: "",
    descripcion: "",
    fk_id_especie: "",
    fk_id_semillero: "",
  });

  useEffect(() => {
    if (cultivo) {
      setFormData({
        nombre_cultivo: cultivo.nombre_cultivo || "",
        fecha_plantacion: cultivo.fecha_plantacion?.toString().slice(0, 10) || "",
        descripcion: cultivo.descripcion || "",
        fk_id_especie: String(cultivo.fk_id_especie?.id ?? ""),
        fk_id_semillero: String(cultivo.fk_id_semillero?.id ?? ""),
      });
    }
  }, [cultivo]);

  const especiesUnicas = Array.from(
    new Map(todos.map((c) => [c.fk_id_especie.id, c.fk_id_especie])).values()
  );
  const semillerosUnicos = Array.from(
    new Map(todos.map((c) => [c.fk_id_semillero.id, c.fk_id_semillero])).values()
  );

  const opcionesEspecies = especiesUnicas.map((e) => ({
    value: String(e.id),
    label: e.nombre_comun,
  }));
  const opcionesSemilleros = semillerosUnicos.map((s) => ({
    value: String(s.id),
    label: s.nombre_semilla,
  }));

  const handleSubmit = (data: Record<string, string>) => {
    actualizarCultivo.mutate(
      {
        id: +id,
        nombre_cultivo: data.nombre_cultivo,
        fecha_plantacion: data.fecha_plantacion,
        descripcion: data.descripcion,
        fk_id_especie: parseInt(data.fk_id_especie),
        fk_id_semillero: parseInt(data.fk_id_semillero),
      },
      {
        onSuccess: () => {
          onSuccess(); 
        },
        onError: (err) => console.error(err),
      }
    );
  };

  if (isLoading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-500">Error al cargar cultivo</p>;

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
          { id: "fecha_plantacion", label: "Fecha de Plantación", type: "date" },
          { id: "descripcion", label: "Descripción", type: "text" },
          {
            id: "fk_id_especie",
            label: "Especie",
            type: "select",
            options: opcionesEspecies,
          },
          {
            id: "fk_id_semillero",
            label: "Semillero",
            type: "select",
            options: opcionesSemilleros,
          },
        ]}
      />
    </div>
  );
};

export default ActualizarCultivo;