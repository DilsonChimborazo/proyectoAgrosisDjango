import { useState, useEffect } from "react";
import { usePlantacionPorId } from "../../../hooks/trazabilidad/plantacion/usePlantacionPorId";
import { usePlantacion } from "../../../hooks/trazabilidad/plantacion/usePlantacion";
import { useActualizarPlantacion } from "../../../hooks/trazabilidad/plantacion/useActualizarPlantacion";
import Formulario from "../../globales/Formulario";
import { showToast } from "@/components/globales/Toast";

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
    latitud: "",
    longitud: "",
  });

  useEffect(() => {
    if (plantacion) {
      setFormData({
        fk_id_eras: String(plantacion.fk_id_eras?.id ?? ""),
        fk_id_cultivo: String(plantacion.fk_id_cultivo?.id ?? ""),
        cantidad_transplante: String(plantacion.cantidad_transplante ?? ""),
        fecha_plantacion: plantacion.fecha_plantacion?.toString().slice(0, 10) || "",
        fk_id_semillero: String(plantacion.fk_id_semillero?.id ?? ""),
        latitud: plantacion.latitud !== null ? String(plantacion.latitud) : "",
        longitud: plantacion.longitud !== null ? String(plantacion.longitud) : "",
      });
    }
  }, [plantacion]);

  useEffect(() => {
    if (error) {
      showToast({
        title: "Error al cargar plantación",
        description: "No se pudo cargar la información de la plantación",
        timeout: 5000,
        variant: "error",
      });
    }
  }, [error]);

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
    const errors: string[] = [];

    if (!data.fk_id_eras) errors.push("Era es obligatoria");
    if (!data.fk_id_cultivo) errors.push("Cultivo es obligatorio");
    if (!data.cantidad_transplante || parseInt(data.cantidad_transplante) <= 0) {
      errors.push("Cantidad Transplante debe ser un número mayor a 0");
    }
    if (!data.fecha_plantacion) errors.push("Fecha de Plantación es obligatoria");
    if (!data.fk_id_semillero) errors.push("Semillero es obligatorio");
    if (data.latitud && isNaN(Number(data.latitud))) {
      errors.push("Latitud debe ser un número válido");
    }
    if (data.longitud && isNaN(Number(data.longitud))) {
      errors.push("Longitud debe ser un número válido");
    }

    if (errors.length > 0) {
      showToast({
        title: "Error al actualizar plantación",
        description: errors.join(", "),
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    actualizarPlantacion.mutate(
      {
        id: +id,
        fk_id_eras: parseInt(data.fk_id_eras),
        fk_id_cultivo: parseInt(data.fk_id_cultivo),
        cantidad_transplante: parseInt(data.cantidad_transplante),
        fecha_plantacion: data.fecha_plantacion,
        fk_id_semillero: parseInt(data.fk_id_semillero),
        latitud: data.latitud ? Number(data.latitud) : null,
        longitud: data.longitud ? Number(data.longitud) : null,
      },
      {
        onSuccess: () => {
          showToast({
            title: "Plantación actualizada exitosamente",
            description: "La plantación ha sido actualizada en el sistema",
            timeout: 4000,
            variant: "success",
          });
          onSuccess();
        },
        onError: (err) => {
          showToast({
            title: "Error al actualizar plantación",
            description: err.message || "Error al actualizar la plantación. Intenta de nuevo.",
            timeout: 5000,
            variant: "error",
          });
        },
      }
    );
  };

  if (isLoading) return <p>Cargando...</p>;

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
            id: "latitud",
            label: "Latitud",
            type: "number",
            
          },
          {
            id: "longitud",
            label: "Longitud",
            type: "number",
            
          },
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