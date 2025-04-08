import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface CalendarioLunar {
    id: number;
    fecha: string;
    descripcion_evento: string;
    evento: string;
}

const useCalendarioActivos = () => {
    const [calendarios, setCalendarios] = useState<CalendarioLunar[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchCalendarios = async () => {
            try {
                const response = await axios.get<CalendarioLunar[]>("http://127.0.0.1:8000/api/calendario_lunar/eventosProximos");
                setCalendarios(response.data);
            } catch (err: any) {
                setError(err?.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchCalendarios();
    }, []);

    // Función para generar el PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Eventos Próximos del Calendario Lunar", 14, 10);

        const tablaColumnas = ["ID", "Evento", "Fecha", "Descripción"];
        const tablaFilas = calendarios.map((calendario) => [
            calendario.id,
            calendario.evento,
            new Date(calendario.fecha).toLocaleDateString("es-ES", {
                year: "numeric",
                month: "long",
                day: "numeric",
            }),
            calendario.descripcion_evento,
        ]);

        // Uso de autoTable para generar la tabla
        autoTable(doc, {
            head: [tablaColumnas],
            body: tablaFilas,
            startY: 20,
        });

        doc.save("EventosProximosCalendarioLunar.pdf");
    };

    return { calendarios, loading, error, generarPDF };
};

export default useCalendarioActivos;