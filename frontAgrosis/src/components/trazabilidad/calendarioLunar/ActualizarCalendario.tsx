import { useState, useEffect } from "react";
import { useActualizarCalendarioLunar } from "../../../hooks/trazabilidad/calendarioLunar/useActualizarCalendario";
import Formulario from "../../globales/Formulario";
import { showToast } from "@/components/globales/Toast";

interface ActualizarCalendarioLunarProps {
    calendario: any;
    closeModal: () => void;
}

const ActualizarCalendarioLunar = ({ calendario, closeModal }: ActualizarCalendarioLunarProps) => {
    const actualizarCalendario = useActualizarCalendarioLunar();

    const [formData, setFormData] = useState({
        fecha: calendario?.fecha || "",
        descripcion_evento: calendario?.descripcion_evento || "",
        evento: calendario?.evento || "",
    });

    useEffect(() => {
        if (calendario) {
            setFormData({
                fecha: calendario.fecha || "",
                descripcion_evento: calendario.descripcion_evento || "",
                evento: calendario.evento || "",
            });
        }
    }, [calendario]);

    const handleSubmit = (data: { [key: string]: string }) => {
        if (!calendario?.id) {
            showToast({
                title: "Error al actualizar",
                description: "El ID del calendario lunar no es válido.",
                timeout: 5000,
                variant: "error",
            });
            return;
        }

        const calendarioActualizado = {
            id: calendario.id,
            fecha: data.fecha || "",
            descripcion_evento: data.descripcion_evento || "",
            evento: data.evento || "",
        };

        actualizarCalendario.mutate(calendarioActualizado, {
            onSuccess: () => {
                showToast({
                    title: "Calendario actualizado",
                    description: "El calendario lunar se actualizó correctamente.",
                    timeout: 4000,
                    variant: "success",
                });
                closeModal();
            },
            onError: (error) => {
                showToast({
                    title: "Error al actualizar calendario",
                    description: error.response?.data?.detail || "Hubo un problema al actualizar.",
                    timeout: 5000,
                    variant: "error",
                });
            },
        });
    };

    return (
        <Formulario
            fields={[
                { id: "fecha", label: "Fecha", type: "date" },
                { id: "descripcion_evento", label: "Descripción del Evento", type: "text" },
                { id: "evento", label: "Evento", type: "text" },
            ]}
            onSubmit={handleSubmit}
            isError={actualizarCalendario.isError}
            isSuccess={actualizarCalendario.isSuccess}
            title="Actualizar Calendario Lunar"
            initialValues={formData}
            key={JSON.stringify(formData)}
        />
    );
};

export default ActualizarCalendarioLunar;