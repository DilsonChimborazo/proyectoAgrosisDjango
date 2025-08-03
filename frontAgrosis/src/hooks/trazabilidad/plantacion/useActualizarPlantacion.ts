import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface Plantacion {
    id: number;
    fk_id_eras: number;
    fk_id_cultivo: number;
    cantidad_transplante: number;
    fecha_plantacion: string;
    fk_id_semillero: number;
    latitud: number | null;
    longitud: number | null;
}

export const useActualizarPlantacion = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (plantacionActualizada: Plantacion) => {
            const { id, ...datos } = plantacionActualizada;
            const { data } = await axios.put(`/api/plantacion/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Plantaciones"] });
        },
    });
};