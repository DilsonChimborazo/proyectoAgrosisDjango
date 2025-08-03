import { useQuery } from "@tanstack/react-query";
import axios from "axios";


export interface Ficha {
    id?: number;
    numero_ficha: string;
    nombre_ficha: string;
    abreviacion: string;
    fecha_inicio: string;
    fecha_salida: string;
    is_active?: boolean;
}

const fetchFicha = async (): Promise<Ficha[]> => {
    const token = localStorage.getItem("token");

    if (!token) {
        throw new Error("No hay token de autenticacion");
    } try {
        const response = await axios.get(`/api/ficha/`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        if (!Array.isArray(response.data)) {
            throw new Error("La API no devolvió un array válido.");
        }
            return response.data;
    } catch (error: any) {
        console.error("Error al obtener las fichas:", error.response || error.message);
        throw new Error(
            error.response?.data?.detail || "Error al obtener la lista de fichas"
        );
    }
};

export const UseFicha = () =>{
    return useQuery<Ficha[], Error>({
        queryKey: ['fichas'],
        queryFn: fetchFicha,
        staleTime: 1000 * 60 * 10
    });
};
