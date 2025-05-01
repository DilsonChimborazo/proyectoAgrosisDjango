import { useState } from "react";
import { useCrearPlantacion, Plantacion } from "@/hooks/trazabilidad/plantacion/useCrearPlantacion";
import { usePlantacion } from "@/hooks/trazabilidad/plantacion/usePlantacion";
import { useEras } from "@/hooks/iot/eras/useEras";
import { useCultivo } from "@/hooks/trazabilidad/cultivo/useCultivo";
import { useSemilleros } from "@/hooks/trazabilidad/semillero/useSemilleros";
import Formulario from "../../globales/Formulario";
import VentanaModal from "../../globales/VentanasModales";
import CrearEra from "../../iot/eras/CrearEras";
import CrearCultivo from "../cultivos/CrearCultivos";
import CrearSemillero from "../semillero/CrearSemillero";

interface CrearPlantacionProps {
  onSuccess: () => void;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  options?: { value: string; label: string }[];
  hasExtraButton?: boolean;
  extraButtonText?: string;
  onExtraButtonClick?: () => void;
}

const CrearPlantacion = ({ onSuccess }: CrearPlantacionProps) => {
  const mutation = useCrearPlantacion();
  const { refetch } = usePlantacion();
  const { data: eras = [], isLoading: isLoadingEras } = useEras();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const { data: semilleros = [], isLoading: isLoadingSemilleros } = useSemilleros();

  const [mostrarModalEra, setMostrarModalEra] = useState(false);
  const [mostrarModalCultivo, setMostrarModalCultivo] = useState(false);
  const [mostrarModalSemillero, setMostrarModalSemillero] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const eraOptions = eras.map((era) => ({
    value: String(era.id ?? ""),
    label: era.descripcion ?? "Sin descripción",
  }));

  const cultivoOptions = cultivos.map((cultivo) => ({
    value: String(cultivo.id ?? ""),
    label: cultivo.nombre_cultivo ?? "Sin nombre",
  }));

  const semilleroOptions = semilleros.map((semillero) => ({
    value: String(semillero.id ?? ""),
    label: semillero.nombre_semilla ?? "Sin nombre",
  }));

  // Depuración de las opciones
  console.log("Opciones de Eras:", eraOptions);
  console.log("Opciones de Cultivos:", cultivoOptions);
  console.log("Opciones de Semilleros:", semilleroOptions);

  const formFields: FormField[] = [
    {
      id: "fk_id_eras",
      label: "Era",
      type: "select",
      options: eraOptions,
      hasExtraButton: true,
      extraButtonText: "Crear Era",
      onExtraButtonClick: () => setMostrarModalEra(true),
    },
    {
      id: "fk_id_cultivo",
      label: "Cultivo",
      type: "select",
      options: cultivoOptions,
      hasExtraButton: true,
      extraButtonText: "Crear Cultivo",
      onExtraButtonClick: () => setMostrarModalCultivo(true),
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
      options: semilleroOptions,
      hasExtraButton: true,
      extraButtonText: "Crear Semillero",
      onExtraButtonClick: () => setMostrarModalSemillero(true),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    setErrorMessage(null);

    const errors: string[] = [];
    if (!formData.fk_id_eras) errors.push("Era es obligatoria");
    if (!formData.fk_id_cultivo) errors.push("Cultivo es obligatorio");
    if (!formData.cantidad_transplante || parseInt(formData.cantidad_transplante) <= 0) {
      errors.push("Cantidad Transplante debe ser un número mayor a 0");
    }
    if (!formData.fecha_plantacion) errors.push("Fecha de Plantación es obligatoria");
    if (!formData.fk_id_semillero) errors.push("Semillero es obligatorio");

    if (errors.length > 0) {
      setErrorMessage(errors.join(", "));
      console.error("❌ Validación fallida:", errors.join(", "));
      return;
    }

    const nuevaPlantacion: Plantacion = {
      fk_id_eras: parseInt(formData.fk_id_eras),
      fk_id_cultivo: parseInt(formData.fk_id_cultivo),
      cantidad_transplante: parseInt(formData.cantidad_transplante),
      fecha_plantacion: new Date(formData.fecha_plantacion).toISOString().split('T')[0],
      fk_id_semillero: parseInt(formData.fk_id_semillero),
    };

    mutation.mutate(nuevaPlantacion, {
      onSuccess: () => {
        console.log("✅ Plantación creada exitosamente");
        onSuccess();
      },
      onError: (error) => {
        console.error("❌ Error al crear plantación:", error);
        setErrorMessage("Error al crear la plantación. Intenta de nuevo.");
      },
    });
  };

  const cerrarYActualizar = async () => {
    setMostrarModalEra(false);
    setMostrarModalCultivo(false);
    setMostrarModalSemillero(false);
    await refetch();
  };

  if (isLoadingEras || isLoadingCultivos || isLoadingSemilleros) {
    return <div className="text-center text-gray-500">Cargando datos...</div>;
  }

  if (!eraOptions.length || !cultivoOptions.length || !semilleroOptions.length) {
    return (
      <div className="text-center text-red-500">
        No hay eras, cultivos o semilleros disponibles. Crea algunos primero.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
          {errorMessage}
        </div>
      )}
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Plantación"
      />

      <VentanaModal
        isOpen={mostrarModalEra}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearEra />}
      />

      <VentanaModal
        isOpen={mostrarModalCultivo}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearCultivo onSuccess={cerrarYActualizar} />}
      />

      <VentanaModal
        isOpen={mostrarModalSemillero}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearSemillero />}
      />
    </div>
  );
};

export default CrearPlantacion;