import { useState } from "react";
import { useCrearCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar";
import Formulario from "../../globales/Formulario";
import { showToast } from "@/components/globales/Toast"; // Importar el toast

interface CrearCalendarioLunarProps {
  closeModal: () => void;
}

const CrearCalendarioLunar = ({ closeModal }: CrearCalendarioLunarProps) => {
  const mutation = useCrearCalendarioLunar();

  const formFields = [
    { id: "fecha", label: "Fecha", type: "date", required: true },
    { id: "descripcion_evento", label: "Descripción del Evento", type: "text", required: true },
    { id: "evento", label: "Evento", type: "text", required: true },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fecha || !formData.descripcion_evento || !formData.evento) {
      showToast({
        title: "Error",
        description: "Todos los campos son obligatorios.",
        timeout: 5000,
        variant: "error",
      });
      return;
    }

    const fechaISO = new Date(formData.fecha).toISOString().split("T")[0];

    const nuevoCalendarioLunar = {
      fecha: fechaISO,
      descripcion_evento: formData.descripcion_evento.trim(),
      evento: formData.evento.trim(),
    };

    console.log("🚀 Enviando calendario lunar al backend:", nuevoCalendarioLunar);

    mutation.mutate(nuevoCalendarioLunar, {
      onSuccess: () => {
        showToast({
          title: "Calendario creado",
          description: "El calendario lunar ha sido registrado correctamente.",
          timeout: 4000,
          variant: "success",
        });
        closeModal(); // Cerrar el modal tras éxito
      },
      onError: (error) => {
        showToast({
          title: "Error al crear calendario",
          description: error.response?.data?.detail || "Ocurrió un problema al registrar.",
          timeout: 5000,
          variant: "error",
        });
      },
    });
  };

  return (
    <Formulario
      fields={formFields}
      onSubmit={handleSubmit}
      isError={mutation.isError}
      isSuccess={mutation.isSuccess}
      title="Registra Nuevo Calendario Lunar"
    />
  );
};

export default CrearCalendarioLunar;