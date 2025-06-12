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

  const handleSubmit = (formData: { [key: string]: string | string[] | File }) => {
    const errors: string[] = [];

    // Convertir valores a string, tomando el primer elemento si es un arreglo
    const fk_id_eras = Array.isArray(formData.fk_id_eras) ? formData.fk_id_eras[0] : formData.fk_id_eras;
    const fk_id_cultivo = Array.isArray(formData.fk_id_cultivo) ? formData.fk_id_cultivo[0] : formData.fk_id_cultivo;
    const fk_id_semillero = Array.isArray(formData.fk_id_semillero) ? formData.fk_id_semillero[0] : formData.fk_id_semillero;
    const cantidad_transplante = Array.isArray(formData.cantidad_transplante) ? formData.cantidad_transplante[0] : formData.cantidad_transplante;
    const fecha_plantacion = Array.isArray(formData.fecha_plantacion) ? formData.fecha_plantacion[0] : formData.fecha_plantacion;
    const latitud = Array.isArray(formData.latitud) ? formData.latitud[0] : formData.latitud;
    const longitud = Array.isArray(formData.longitud) ? formData.longitud[0] : formData.longitud;

    // Validaciones
    if (!fk_id_eras || typeof fk_id_eras !== "string") errors.push("Era es obligatoria");
    if (!fk_id_cultivo || typeof fk_id_cultivo !== "string") errors.push("Cultivo es obligatorio");
    if (!cantidad_transplante || typeof cantidad_transplante !== "string" || parseInt(cantidad_transplante) <= 0) {
      errors.push("Cantidad Transplante debe ser un número mayor a 0");
    }
    if (!fecha_plantacion || typeof fecha_plantacion !== "string") errors.push("Fecha de Plantación es obligatoria");
    if (!fk_id_semillero || typeof fk_id_semillero !== "string") errors.push("Semillero es obligatorio");
    if (latitud && typeof latitud === "string" && isNaN(Number(latitud))) {
      errors.push("Latitud debe ser un número válido");
    }
    if (longitud && typeof longitud === "string" && isNaN(Number(longitud))) {
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
        fk_id_eras: parseInt(fk_id_eras as string),
        fk_id_cultivo: parseInt(fk_id_cultivo as string),
        cantidad_transplante: parseInt(cantidad_transplante as string),
        fecha_plantacion: fecha_plantacion as string,
        fk_id_semillero: parseInt(fk_id_semillero as string),
        latitud: latitud && typeof latitud === "string" ? Number(latitud) : null,
        longitud: longitud && typeof longitud === "string" ? Number(longitud) : null,
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