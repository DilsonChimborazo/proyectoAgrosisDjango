import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ReportePorEstado {
    estado: string;
    cantidad: number;
    stock_total: number;
}

export interface ResumenGeneral {
    total_herramientas: number;
    total_stock: number;
    estados_disponibles: string[];
}

export interface RespuestaReporte {
    reporte_por_estado: ReportePorEstado[];
    resumen_general: ResumenGeneral;
    estructura: {
        reporte: string;
        resumen: string;
    };
}

export const useReporteHerramientas = () => {
    return useQuery<RespuestaReporte>({
        queryKey: ["reporte_herramientas_estado"],
        queryFn: async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("⚠️ Token de autenticación no encontrado.");
            }

            const { data } = await axios.get(`${apiUrl}herramientas/reporte-estado/`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            return data;
        },
    });
};
