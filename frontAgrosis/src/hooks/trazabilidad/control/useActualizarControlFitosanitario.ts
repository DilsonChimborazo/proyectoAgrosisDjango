import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    descripcion: string;
    tipo_control: string;
    fk_id_cultivo: number; // Solo ID del cultivo
    fk_id_pea: number;      // Solo ID del PEA
}

export const useActualizarControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (controlActualizado: ControlFitosanitario) => {
            const { id, ...datos } = controlActualizado;
            const { data } = await axios.put(`${apiUrl}control_fitosanitario/${id}/`, datos);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["ControlFitosanitario"] }); // Refresca la lista de controles
        },
    });
};
