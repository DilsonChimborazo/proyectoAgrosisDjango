import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useActualizarResiduo = () => {
    return useMutation({
        mutationFn: async (residuo: { id: number; nombre_residuo: string; fecha: string; descripcion: string; fk_id_cultivo: number | null; fk_id_tipo_residuo: number | null }) => {
            const { id, ...datosActualizados } = residuo;
            const { data } = await axios.put(`${apiUrl}residuos/${id}/`, datosActualizados);
            return data;
        },
    });
};