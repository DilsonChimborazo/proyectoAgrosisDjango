import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


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

            try {
                const { data } = await axios.put(`/api/especies/${id}/`, datos);
                return data;
            } catch (error: any) {
                throw error; // Relanzar el error para manejarlo en el componente
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["especies"] }); // Refrescar datos
        },
    });
};