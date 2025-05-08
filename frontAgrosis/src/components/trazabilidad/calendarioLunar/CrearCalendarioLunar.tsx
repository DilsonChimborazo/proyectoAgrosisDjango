import { CalendarioLunar } from '../../../hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';
import { useCrearCalendarioLunar } from '../../../hooks/trazabilidad/calendarioLunar/useCrearCalendarioLunar';
import Formulario from '../../globales/Formulario';

interface CrearCalendarioLunarProps {
  closeModal: () => void;
}

const CrearCalendarioLunar = ({ closeModal }: CrearCalendarioLunarProps) => {
  const mutation = useCrearCalendarioLunar();

  const formFields = [
    { id: 'fecha', label: 'Fecha', type: 'date' },
    { id: 'descripcion_evento', label: 'Descripcion del Evento', type: 'text' },
    { id: 'evento', label: 'Evento', type: 'text' },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.fecha) {
      console.error("Error: La fecha es obligatoria.");
      return;
    }

    const fechaISO = new Date(formData.fecha).toISOString().split("T")[0];

    const nuevoCalendarioLunar: CalendarioLunar = {
      fecha: fechaISO,
      descripcion_evento: formData.descripcion_evento,
      evento: formData.evento,
    };

    console.log("Enviando calendario lunar al backend:", nuevoCalendarioLunar);

    mutation.mutate(nuevoCalendarioLunar, {
      onSuccess: () => {
        console.log("Calendario lunar creado exitosamente, cerrando modal...");
        closeModal();
      },
      onError: (error) => {
        console.error("Error al crear calendario lunar:", error);
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