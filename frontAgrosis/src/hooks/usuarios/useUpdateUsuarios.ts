import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

interface Rol {
    id: number;
    nombre: string;
}

export interface Usuario {
    id: number;
    identificacion?: number;
    email?: string;
    nombre?: string;
    apellido?: string;
    password?: string;
    fk_id_rol?: Rol;
}

export const useActualizarUsuario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (usuarioActualizado: Partial<Usuario>) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }

            const { id, ...datos } = usuarioActualizado;

            const { data } = await axios.patch(`${apiUrl}usuario/${id}/`, datos, {
                headers: { Authorization: `Bearer ${token}` },
            });

            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["Usuario"] });
        },
    });
};
