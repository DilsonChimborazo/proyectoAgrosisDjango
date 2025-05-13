import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Especie {
    id: number; // ID único de la especie
    nombre_comun: string;
    nombre_cientifico: string;
    descripcion: string;
    fk_id_tipo_cultivo: number | null; // Puede ser null
}

export const useActualizarEspecie = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (especieActualizada: Especie) => {
            const { id, ...datos } = especieActualizada; // Extraer ID y preparar datos
            console.log("📡 Enviando datos para actualizar:", datos);

            try {
                const { data } = await axios.put(`${apiUrl}especies/${id}/`, datos);
                console.log("✅ Respuesta del backend:", data);
                return data;
            } catch (error: any) {
                console.error(
                    "❌ Error al actualizar la especie:",
                    error.response?.data || error.message || "Error desconocido"
                );
                throw error; // Relanzar el error para manejarlo en el componente
            }
        },
        onSuccess: () => {
            console.log("✅ Especie actualizada con éxito");
            queryClient.invalidateQueries({ queryKey: ["especies"] }); // Refrescar datos
        },
        onError: (error) => {
            console.error("❌ Error en la actualización:", error);
        },
    });
};