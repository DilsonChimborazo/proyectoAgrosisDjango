import { useState, useEffect } from "react";
import { usePlantacionPorId } from "../../../hooks/trazabilidad/plantacion/usePlantacionPorId";
import { usePlantacion } from "../../../hooks/trazabilidad/plantacion/usePlantacion";
import { useActualizarPlantacion } from "../../../hooks/trazabilidad/plantacion/useActualizarPlantacion";
import Formulario from "../../globales/Formulario";

interface ActualizarPlantacionProps {
  id: string | number;
  onSuccess: () => void;
}

const ActualizarPlantacion = ({ id, onSuccess }: ActualizarPlantacionProps) => {
  const { data: plantacion, isLoading, error } = usePlantacionPorId(String(id));
  const { data: todas = [] } = usePlantacion();
  const actualizarPlantacion = useActualizarPlantacion();

  const [formData, setFormData] = useState<Record<string, string>>({
    fk_id_eras: "",
    fk_id_cultivo: "",
    cantidad_transplante: "",
    fecha_plantacion: "",
    fk_id_semillero: "",
  });

  useEffect(() => {
    if (plantacion) {
      setFormData({
        fk_id_eras: String(plantacion.fk_id_eras?.id ?? ""),
        fk_id_cultivo: String(plantacion.fk_id_cultivo?.id ?? ""),
        cantidad_transplante: String(plantacion.cantidad_transplante ?? ""),
        fecha_plantacion: plantacion.fecha_plantacion?.toString().slice(0, 10) || "",
        fk_id_semillero: String(plantacion.fk_id_semillero?.id ?? ""),
      });
    }
  }, [plantacion]);

  const erasUnicas = Array.from(
    new Map(todas.map((p) => [p.fk_id_eras?.id, p.fk_id_eras])).values()
  ).filter((era): era is NonNullable<typeof era> => era !== null);

  const cultivosUnicos = Array.from(
    new Map(todas.map((p) => [p.fk_id_cultivo?.id, p.fk_id_cultivo])).values()
  ).filter((cultivo): cultivo is NonNullable<typeof cultivo> => cultivo !== null);

  const semillerosUnicos = Array.from(
    new Map(todas.map((p) => [p.fk_id_semillero?.id, p.fk_id_semillero])).values()
  ).filter((semillero): semillero is NonNullable<typeof semillero> => semillero !== null);

  const opcionesEras = erasUnicas.map((e) => ({
    value: String(e.id),
    label: e.descripcion,
  }));

  const opcionesCultivos = cultivosUnicos.map((c) => ({
    value: String(c.id),
    label: c.nombre_cultivo,
  }));

  const opcionesSemilleros = semillerosUnicos.map((s) => ({
    value: String(s.id),
    label: s.nombre_semilla,
  }));

  const handleSubmit = (data: Record<string, string>) => {
    actualizarPlantacion.mutate(
      {
        id: +id,
        fk_id_eras: parseInt(data.fk_id_eras),
        fk_id_cultivo: parseInt(data.fk_id_cultivo),
        cantidad_transplante: parseInt(data.cantidad_transplante),
        fecha_plantacion: data.fecha_plantacion,
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
  if (error) return <p className="text-red-500">Error al cargar plantación</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        title="Actualizar Plantación"
        initialValues={formData}
        key={JSON.stringify(formData)}
        onSubmit={handleSubmit}
        isError={actualizarPlantacion.isError}
        isSuccess={actualizarPlantacion.isSuccess}
        fields={[
          {
            id: "fk_id_eras",
            label: "Era",
            type: "select",
            options: opcionesEras,
          },
          {
            id: "fk_id_cultivo",
            label: "Cultivo",
            type: "select",
            options: opcionesCultivos,
          },
          {
            id: "cantidad_transplante",
            label: "Cantidad Transplante",
            type: "number",
          },
          {
            id: "fecha_plantacion",
            label: "Fecha de Plantación",
            type: "date",
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

export default ActualizarPlantacion;