import { useState } from "react";
import { useCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar";
import useCalendarioActivos from "../../../hooks/trazabilidad/calendarioLunar/useCalendariosActivos";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import CrearCalendarioLunar from "./CrearCalendarioLunar";
import ActualizarCalendarioLunar from "../calendarioLunar/ActualizarCalendario";

const CalendariosLunares = () => {
  const { data: calendarios, error, isLoading } = useCalendarioLunar();
  const { generarPDF } = useCalendarioActivos();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedCalendario, setSelectedCalendario] = useState<any>(null);

  const openModal = (calendario: any) => {
    setSelectedCalendario(calendario);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCalendario(null);
  };

  const openCreateModal = () => {
    setIsCreateModalOpen(true);
  };

  const closeCreateModal = () => {
    setIsCreateModalOpen(false);
  };

  const openUpdateModal = (calendario: any) => {
    setSelectedCalendario(calendario);
    setIsUpdateModalOpen(true);
  };

  const closeUpdateModal = () => {
    setIsUpdateModalOpen(false);
    setSelectedCalendario(null);
  };

  const handleUpdate = (calendario: { id: number }) => {
    if (!calendario.id) {
      console.error("❌ El ID del calendario no está definido.");
      return;
    }
    openUpdateModal(calendario);
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
    <div className="overflow-x-auto rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Calendarios Lunares</h2>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={generarPDF}
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
        onCreate={openCreateModal}
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

      <VentanaModal
        isOpen={isCreateModalOpen}
        onClose={closeCreateModal}
        titulo="Registra Nuevo Calendario Lunar"
        contenido={<CrearCalendarioLunar closeModal={closeCreateModal} />}
      />

      <VentanaModal
        isOpen={isUpdateModalOpen}
        onClose={closeUpdateModal}
        titulo="Actualizar Calendario Lunar"
        contenido={
          selectedCalendario && (
            <ActualizarCalendarioLunar
              calendario={selectedCalendario}
              closeModal={closeUpdateModal}
            />
          )
        }
      />
    </div>
  );
};

export default CalendariosLunares;