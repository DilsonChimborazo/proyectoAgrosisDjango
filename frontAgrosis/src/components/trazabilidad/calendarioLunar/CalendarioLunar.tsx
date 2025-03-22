import { useState } from "react";
import { useCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useCalendarioLunar";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import Button from "../../globales/Button";
import { useNavigate } from "react-router-dom";

const CalendariosLunares = () => {
  const { data: calendarios, isLoading, error } = useCalendarioLunar();
  const [selectedCalendario, setSelectedCalendario] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Manejar la apertura del modal
  const openModalHandler = (calendario: object) => {
    setSelectedCalendario(calendario);
    setIsModalOpen(true);
  };

  // Cerrar modal
  const closeModal = () => {
    setSelectedCalendario(null);
    setIsModalOpen(false);
  };

  // Redirigir a actualizar calendario lunar
  const handleUpdate = (calendario: { id: number }) => {
    if (!calendario.id) {
      console.error("❌ El calendario lunar no tiene un ID válido.");
      return;
    }
    console.log("🔄 Redirigiendo a actualizar calendario lunar con ID:", calendario.id);
    navigate(`/actualizarcalendariolunar/${calendario.id}`);
  };

  // Definir los headers de la tabla antes de usarlos
  const headers = ["ID", "Fecha", "Descripción del Evento", "Evento", "Acciones"];

  // Asegurar que 'calendarios' es un arreglo antes de mapear
  const calendariosList = Array.isArray(calendarios) ? calendarios : [];

  const mappedCalendarios = calendariosList.map((calendario) => ({
    id: calendario.id,
    fecha: new Date(calendario.fecha).toLocaleDateString(),
    descripcion_evento: calendario.descripcion_evento || "N/A",
    evento: calendario.evento,
  }));

  if (isLoading) return <div>Cargando calendarios lunares...</div>;
  if (error instanceof Error)
    return <div>Error al cargar los calendarios lunares: {error.message}</div>;

  return (
    <div className="overflow-x-auto shadow-md rounded-lg p-4">
      <Button
        text="Crear Calendario Lunar"
        className="mx-2"
        onClick={() => navigate("/crearcalendariolunar")}
        variant="success"
      />

      <Tabla
        title="Listar Calendarios Lunares"
        headers={headers}
        data={mappedCalendarios}
        onClickAction={openModalHandler}
        onUpdate={handleUpdate}  
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
