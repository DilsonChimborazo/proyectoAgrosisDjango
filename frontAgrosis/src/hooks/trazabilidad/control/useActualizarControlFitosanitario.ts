import { useMutation } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export const useActualizarControlFitosanitario = () => {
    return useMutation({
        mutationFn: async (control: { id: number; fecha_control: string; descripcion: string }) => {
            const { id, ...datosActualizados } = control;
            const { data } = await axios.put(`${apiUrl}control_fitosanitario/${id}/`, datosActualizados);
            return data;
        },
    });
};
