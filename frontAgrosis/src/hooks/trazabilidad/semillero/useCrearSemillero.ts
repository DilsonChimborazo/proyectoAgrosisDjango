import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id_semillero: number; // ID único
    nombre_semillero: string; // Nombre del semillero
    fecha_siembra: string;  // Fecha en formato ISO
    fecha_estimada: string; // Fecha estimada en formato ISO
    cantidad: number;       // Cantidad de semilleros
}

export const useCrearSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoSemillero: Semillero) => {
            console.log("🚀 Datos enviados al backend:", nuevoSemillero);
            const { data } = await axios.post(`${apiUrl}semilleros/`, nuevoSemillero); // Endpoint correcto
            return data;
        },
        onSuccess: () => {
            console.log("✅ Semillero creado con éxito");
            queryClient.invalidateQueries({ queryKey: ["Semilleros"] }); // Refresca la lista automáticamente
        },
        onError: (error) => {
            console.error("❌ Error al crear semillero:", error); // Muestra el error
        },
    });
};
