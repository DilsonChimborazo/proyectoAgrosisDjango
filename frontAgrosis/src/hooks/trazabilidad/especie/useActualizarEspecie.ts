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
            const { id, ...datos } = especieActualizada; // Extraer el ID y preparar los datos
            console.log("📡 Enviando datos para actualizar:", datos); // Depuración

            try {
                const { data } = await axios.put(`${apiUrl}especies/${id}/`, datos); // PUT al endpoint
                console.log("✅ Respuesta del backend:", data);
                return data;
            } catch (error: any) {
                // Manejo robusto de errores
                if (error.response) {
                    console.error("❌ Error del backend:", error.response.data);
                } else if (error.message) {
                    console.error("❌ Error de red u otra causa:", error.message);
                } else {
                    console.error("❌ Error desconocido:", error);
                }
                throw error; // Relanzar el error para manejarlo en el componente
            }
        },
        onSuccess: () => {
            console.log("✅ Especie actualizada con éxito"); // Confirmación
            queryClient.invalidateQueries({ queryKey: ["Especies"] }); // Refrescar la lista de especies
        },
       
        },
    )}

