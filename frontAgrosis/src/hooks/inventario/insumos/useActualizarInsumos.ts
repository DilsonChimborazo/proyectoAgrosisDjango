import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    id_insumo: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    unidad_medida: string;
}

const actualizarInsumo = async (insumo: Insumo) => {
    try {
        const { data } = await axios.put(`${apiUrl}/insumos/${insumo.id_insumo}`, insumo);
        return data;
    } catch (error) {
        console.error("Error al actualizar el insumo:", error);
        throw new Error("No se pudo actualizar el insumo");
    }
};

export const useActualizarInsumo = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: actualizarInsumo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["insumos"] });
        },
    });
};

