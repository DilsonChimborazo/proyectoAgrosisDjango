import { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 

export interface Ubicacion {
    id: number;
    latitud: number;
    longitud: number;
}

export interface Lotes {
    id: number;
    fk_id_ubicacion: Ubicacion | null;
    dimencion: string;
    nombre_lote: string;
    estado: string;
}

const useLotesActivos = () => {
    const [lotes, setLotes] = useState<Lotes[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchLotes = async () => {
            try {
                const response = await axios.get<Lotes[]>("http://127.0.0.1:8000/api/lote/lotesActivos");
                setLotes(response.data);
            } catch (err: any) {
                setError(err?.message || "Error desconocido");
            } finally {
                setLoading(false);
            }
        };

        fetchLotes();
    }, []);

    // Función para generar el PDF
    const generarPDF = () => {
        const doc = new jsPDF();
        doc.text("Lotes Activos", 14, 10);

        const tablaColumnas = ["ID", "Nombre", "Dimensión", "Ubicación", "Estado"];
        const tablaFilas = lotes.map(lote => [
            lote.id,
            lote.nombre_lote,
            lote.dimencion,
            lote.fk_id_ubicacion 
                ? `Lat: ${lote.fk_id_ubicacion.latitud}, Lon: ${lote.fk_id_ubicacion.longitud}`
                : "Sin ubicación",
            lote.estado
        ]);

        // 💡 Ahora autoTable se usa correctamente
        autoTable(doc, {
            head: [tablaColumnas],
            body: tablaFilas,
            startY: 20
        });

        doc.save("LotesActivos.pdf");
    };

    return { lotes, loading, error, generarPDF };
};

export default useLotesActivos;
