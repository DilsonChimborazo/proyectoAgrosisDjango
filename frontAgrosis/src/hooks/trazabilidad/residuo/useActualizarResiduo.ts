import { useMutation } from "@tanstack/react-query";
import axios from "axios";


export const useActualizarResiduo = () => {
    return useMutation({
        mutationFn: async (residuo: { id: number; nombre: string; fecha: string; descripcion: string; fk_id_cultivo: number | null; fk_id_tipo_residuo: number | null }) => {
            const { id, ...datosActualizados } = residuo;
            const { data } = await axios.put(`/api/residuos/${id}/`, datosActualizados);
            return data;
        },
    });
};