import { useState } from "react";
import { useCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import { useNavigate } from "react-router-dom";

const CalendariosLunares = () => {
  const { data: calendarios, error, isLoading } = useCalendarioLunar();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCalendario, setSelectedCalendario] = useState<any>(null);

  const navigate = useNavigate();

  // Abrir modal con la información de un calendario específico
  const openModal = (calendario: any) => {
    setSelectedCalendario(calendario);
    setIsModalOpen(true);
  };

  // Cerrar el modal y limpiar selección
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCalendario(null);
  };

  // Navegar a la página para actualizar un calendario lunar
  const handleUpdate = (calendario: { id: number }) => {
    navigate(`/actualizarcalendariolunar/${calendario.id}`);
  };

  // Navegar a la página para crear un nuevo calendario lunar
  const handleCreate = () => {
    navigate("/CrearCalendarioLunar");
  };

  if (isLoading)
    return (
      <div className="text-center text-gray-500">
        Cargando calendarios lunares...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500">
        Error al cargar los calendarios lunares: {error.message}
      </div>
    );

  const tablaData = (calendarios ?? []).map((calendario) => ({
    id: calendario.id,
    fecha: calendario.fecha
      ? new Date(calendario.fecha).toLocaleDateString("es-ES", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      : "Sin fecha",
      descripcion_evento: calendario.descripcion_evento || "N/A",
    evento: calendario.evento || "Sin evento",
  }));

  const headers = ["ID", "Fecha", "Descripcion Evento", "Evento"];

  return (
    <div className="">
      <Tabla
        title="Lista de Calendarios Lunares"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedCalendario && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Calendario Lunar"
          contenido={selectedCalendario}
        />
      )}
    </div>
  );
};

export default CalendariosLunares;