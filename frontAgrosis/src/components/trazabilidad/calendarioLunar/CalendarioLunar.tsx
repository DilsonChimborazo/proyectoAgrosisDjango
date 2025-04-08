import { useState } from "react";
import { useCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar"; // Hook para cargar los calendarios existentes
import useCalendarioActivos from "../../../hooks/trazabilidad/calendarioLunar/useCalendariosActivos"; // Hook para generar el PDF
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import { useNavigate } from "react-router-dom";

const CalendariosLunares = () => {
  const { data: calendarios, error, isLoading } = useCalendarioLunar();
  const { generarPDF } = useCalendarioActivos(); // Función del hook para generar el PDF
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
    if (!calendario.id) {
      console.error("El ID del calendario no está definido.");
      return;
    }
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

  // Mapeo de datos para la tabla
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
    <div className="overflow-x-auto rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Calendarios Lunares</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={generarPDF} // Llama al hook para generar el PDF
        >
          Descargar PDF
        </button>
      </div>

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