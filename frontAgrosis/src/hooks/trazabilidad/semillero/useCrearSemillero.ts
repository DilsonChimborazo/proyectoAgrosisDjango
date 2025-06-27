import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id: number; // ID único
    nombre_semilla: string; // Nombre del semillero
    fecha_siembra: string;  // Fecha en formato ISO
    fecha_estimada: string; // Fecha estimada en formato ISO
    cantidad: number;       // Cantidad de semilleros
}

export const useCrearSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoSemillero: Semillero) => {

            const { data } = await axios.post(`${apiUrl}semilleros/`, nuevoSemillero); // Endpoint correcto
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Semilleros"] }); // Refresca la lista automáticamente
        },
    });
};
