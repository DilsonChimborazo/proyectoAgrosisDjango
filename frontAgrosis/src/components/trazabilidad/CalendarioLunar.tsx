import { useState } from 'react';
import { useCalendarioLunar } from '../../hooks/trazabilidad/useCalendarioLunar';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import Button from '../globales/Button';
import { useNavigate } from 'react-router-dom';


const CalendariosLunares = () => {
    const { data: calendarios, isLoading, error } = useCalendarioLunar();
    const [selectedCalendario, setSelectedCalendario] = useState<object | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const openModalHandler = (calendario: object) => {
        setSelectedCalendario(calendario);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setSelectedCalendario(null);
        setIsModalOpen(false);
    };

    const handleUpdate = (calendario: { id: number }) => {
        if (!calendario.id) {
            console.error("❌ El calendario lunar no tiene un ID válido.");
            return;
        }

        console.log("🔄 Redirigiendo a actualizar calendario lunar con ID:", calendario.id);
        navigate(`/actualizarcalendariolunar/${calendario.id}`);
    };

    if (isLoading) return <div>Cargando calendarios lunares...</div>;
    if (error instanceof Error)
        return <div>Error al cargar los calendarios lunares: {error.message}</div>;

    const calendariosList = Array.isArray(calendarios) ? calendarios : [];

    const mappedCalendarios = calendariosList.map((calendario) => ({
        id: calendario.id,
        fecha: new Date(calendario.fecha).toLocaleDateString(),
        descripcion_evento: calendario.descripcion_evento,
        evento: calendario.evento,
        acciones: (
            <button
                className="bg-blue-500 text-white px-3 py-1 rounded"
                onClick={() => handleUpdate(calendario)}
            >
                Editar
            </button>
        ),
    }));

    const headers = [
        "ID",
        "Fecha",
        "Descripción del Evento",
        "Evento",
        "Acciones",
    ];

    return (
        <div className="overflow-x-auto shadow-md rounded-lg">
            <Button
                text="Crear Calendario Lunar"
                className="mx-2"
                onClick={() => navigate("/crearcalendariolunar")}
                variant="success"
            />

            <Tabla
                title="Listar Calendarios Lunares"
                headers={[...headers]}
                data={mappedCalendarios}
                onClickAction={openModalHandler}
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
