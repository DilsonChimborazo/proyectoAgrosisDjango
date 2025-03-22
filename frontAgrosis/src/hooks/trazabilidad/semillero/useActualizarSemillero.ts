import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Semillero {
    id: number; // ID único del semillero
    nombre_semillero: string;
    fecha_siembra: string;
    fecha_estimada: string;
    cantidad: number;
}

export const useActualizarSemillero = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (semilleroActualizado: Semillero) => {
            const { id, ...datos } = semilleroActualizado; // Extraer el ID y preparar los datos
            console.log("📡 Enviando datos para actualizar semillero:", datos); // Depuración
            const { data } = await axios.put(`${apiUrl}semilleros/${id}/`, datos); // Enviar PUT al endpoint
            return data;
        },
        onSuccess: () => {
            console.log("✅ Semillero actualizado con éxito"); // Confirmación
            queryClient.invalidateQueries({ queryKey: ["Semilleros"] }); // Refrescar la lista de semilleros
        },
        
        },
    )
}
