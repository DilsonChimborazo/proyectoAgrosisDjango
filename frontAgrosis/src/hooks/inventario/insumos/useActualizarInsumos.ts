import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    stock: number;
    unidad_medida: string;
}

export const useActualizarInsumos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (eraActualizada: Insumo) => {
            const { id, ...datos } = eraActualizada;

            // Validar antes de enviar
            if (
                !datos.nombre.trim() ||
                !datos.tipo.trim() ||
                !datos.unidad_medida.trim() ||
                datos.precio_unidad < 0 ||
                datos.stock < 0
            ) {
                throw new Error("⚠️ Datos inválidos. Verifica los campos del insumo.");
            }

            console.log("📝 Enviando datos para actualizar:", datos);

            // Obtener token de localStorage o de donde lo estés guardando
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("⚠️ Token de autenticación no encontrado.");
            }

            try {
                const { data } = await axios.put(`${apiUrl}insumo/${id}/`, datos, {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw error;
            }
        },
        onSuccess: () => {
            console.log("✅ Insumo actualizado con éxito");
            queryClient.invalidateQueries({ queryKey: ["insumo"] });
        },
        onError: (error) => {
            console.error("❌ Error al actualizar el insumo:", error);
        },
    });
};
