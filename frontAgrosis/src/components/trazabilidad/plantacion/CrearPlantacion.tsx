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
import { showToast } from "@/components/globales/Toast";

interface CrearPlantacionProps {
  onSuccess: () => void;
  onCancel?: () => void;
}

interface FormField {
  id: string;
  label: string;
  type: "text" | "date" | "number" | "select";
  options?: { value: string; label: string }[];
  hasExtraButton?: boolean;
  extraButtonText?: string;
  onExtraButtonClick?: () => void;
  extraContent?: React.ReactNode;
  step?: string; // Para inputs numéricos con valores decimales
}

const CrearPlantacion = ({ onSuccess, onCancel }: CrearPlantacionProps) => {
  const mutation = useCrearPlantacion();
  const { refetch } = usePlantacion();
  const { data: eras = [], isLoading: isLoadingEras } = useEras();
  const { data: cultivos = [], isLoading: isLoadingCultivos } = useCultivo();
  const { data: semilleros = [], isLoading: isLoadingSemilleros } = useSemilleros();

  const [mostrarModalEra, setMostrarModalEra] = useState(false);
  const [mostrarModalCultivo, setMostrarModalCultivo] = useState(false);
  const [mostrarModalSemillero, setMostrarModalSemillero] = useState(false);
  const [selectedSemilleroId, setSelectedSemilleroId] = useState<string | null>(null);

  const eraOptions = eras.map((era) => ({
    value: String(era.id ?? ""),
    label: era.nombre ?? "Sin nombre",
  }));

  const cultivoOptions = cultivos.map((cultivo) => ({
    value: String(cultivo.id ?? ""),
    label: cultivo.nombre_cultivo ?? "Sin nombre",
  }));

  const semilleroOptions = semilleros.map((semillero) => ({
    value: String(semillero.id ?? ""),
    label: semillero.nombre_semilla ?? "Sin nombre",
  }));

  const selectedSemillero = semilleros.find(
    (semillero) => String(semillero.id) === selectedSemilleroId
  );

  const handleFieldChange = (fieldId: string, value: string) => {
    if (fieldId === "fk_id_semillero") {
      setSelectedSemilleroId(value);
    }
  };

  const formFields: FormField[] = [
    {
      id: "latitud",
      label: "Latitud",
      type: "number",
      step: "0.000001", // Permite valores decimales con hasta 6 decimales
    },
    {
      id: "longitud",
      label: "Longitud",
      type: "number",
      step: "0.000001", // Permite valores decimales con hasta 6 decimales
    },
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
      extraContent: selectedSemillero ? (
        <div className="text-sm text-green-600 text-center">
          Cantidad disponible del semillero seleccionado: {selectedSemillero.cantidad ?? 0}
        </div>
      ) : null,
    },
    {
      id: "cantidad_transplante",
      label: "Cantidad Transplante",
      type: "number",
      step: "1", 
    },  
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    const errors: string[] = [];

    // Validaciones
    if (!formData.fk_id_eras) errors.push("Era es obligatoria");
    if (!formData.fk_id_cultivo) errors.push("Cultivo es obligatorio");
    if (!formData.cantidad_transplante || parseInt(formData.cantidad_transplante) <= 0) {
      errors.push("Cantidad Transplante debe ser un número mayor a 0");
    }
    if (!formData.fecha_plantacion) errors.push("Fecha de Plantación es obligatoria");
    if (!formData.fk_id_semillero) errors.push("Semillero es obligatorio");
    // Validar que latitud y longitud sean válidos si se proporcionan
    if (formData.latitud && isNaN(Number(formData.latitud))) {
      errors.push("Latitud debe ser un número válido");
    }
    if (formData.longitud && isNaN(Number(formData.longitud))) {
      errors.push("Longitud debe ser un número válido");
    }

    if (errors.length > 0) {
      showToast({
        title: "Error al crear plantación",
        description: errors.join(", "),
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    const nuevaPlantacion: Plantacion = {
      fk_id_eras: parseInt(formData.fk_id_eras),
      fk_id_cultivo: parseInt(formData.fk_id_cultivo),
      cantidad_transplante: parseInt(formData.cantidad_transplante),
      fecha_plantacion: new Date(formData.fecha_plantacion).toISOString().split("T")[0],
      fk_id_semillero: parseInt(formData.fk_id_semillero),
      latitud: formData.latitud ? Number(formData.latitud) : null,
      longitud: formData.longitud ? Number(formData.longitud) : null,
    };

    mutation.mutate(nuevaPlantacion, {
      onSuccess: () => {
        showToast({
          title: "Plantación creada exitosamente",
          description: "La plantación ha sido registrada en el sistema",
          timeout: 4000,
          variant: "success",
        });
        onSuccess();
      },
      onError: (error) => {
        showToast({
          title: "Error al crear plantación",
          description: error.message || "Error al crear la plantación. Intenta de nuevo.",
          timeout: 5000,
          variant: "error",
        });
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

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Formulario
        fields={formFields}
        onSubmit={handleSubmit}
        onFieldChange={handleFieldChange}
        isError={mutation.isError}
        isSuccess={mutation.isSuccess}
        title="Registrar Nueva Plantación"
        onCancel={onCancel}
      />

      <VentanaModal
        isOpen={mostrarModalEra}
        onClose={cerrarYActualizar}
        titulo=""
        contenido={<CrearEra onSuccess={cerrarYActualizar} />}
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
        contenido={<CrearSemillero onSuccess={cerrarYActualizar} />}
      />
    </div>
  );
};

export default CrearPlantacion;