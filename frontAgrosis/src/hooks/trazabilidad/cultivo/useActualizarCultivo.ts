    import { useMutation, useQueryClient } from "@tanstack/react-query";
    import axios from "axios";

    export interface Cultivo {
        id: number;
        nombre_cultivo: string;
        descripcion: string;
        fk_id_especie: number;
    }

    export const useActualizarCultivo = () => {
        const queryClient = useQueryClient();

        return useMutation({
            mutationFn: async (cultivoActualizado: Cultivo) => {
                const { id, ...datos } = cultivoActualizado;
                const { data } = await axios.put(`/api/cultivo/${id}/`, datos);
                return data;
            },
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["Cultivos"] }); // Actualizar la lista de cultivos
            },
        });
    };
