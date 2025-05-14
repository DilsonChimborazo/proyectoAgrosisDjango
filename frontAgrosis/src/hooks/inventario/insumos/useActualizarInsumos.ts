import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface UnidadMedida {
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';
    factor_conversion: number;
}

export interface Insumo {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad_insumo: number;
    fecha_vencimiento?: string | null;
    img?: File | null;
    fk_unidad_medida: UnidadMedida | number;
}

export const useActualizarInsumos = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (insumoActualizado: Insumo) => {
            const { id, fk_unidad_medida, ...datosSinUnidad } = insumoActualizado;

            // Validación de campos
            if (
                !datosSinUnidad.nombre.trim() ||
                !datosSinUnidad.tipo.trim() ||
                datosSinUnidad.precio_unidad < 0 ||
                datosSinUnidad.cantidad_insumo < 0 ||
                !datosSinUnidad.fecha_vencimiento
            ) {
                throw new Error("⚠️ Datos inválidos. Verifica los campos del insumo.");
            }

            const token = localStorage.getItem("token");
            if (!token) throw new Error("⚠️ Token de autenticación no encontrado.");

            // Crear FormData
            const formData = new FormData();
            formData.append("nombre", datosSinUnidad.nombre);
            formData.append("tipo", datosSinUnidad.tipo);
            formData.append("precio_unidad", String(datosSinUnidad.precio_unidad));
            formData.append("cantidad_insumo", String(datosSinUnidad.cantidad_insumo)); // Cambiado de "cantidad" a "cantidad_insumo"
            formData.append("fecha_vencimiento", datosSinUnidad.fecha_vencimiento || "");

            // Enviar ID o extraerlo del objeto
            const unidadMedidaId = typeof fk_unidad_medida === "number"
                ? fk_unidad_medida
                : (fk_unidad_medida as any).id || (fk_unidad_medida as any).pk || 1;

            formData.append("fk_unidad_medida", String(unidadMedidaId));

            if (datosSinUnidad.img instanceof File) {
                formData.append("img", datosSinUnidad.img);
            }

            try {
                const { data } = await axios.patch(`${apiUrl}insumo/${id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                return data;
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || "Error al actualizar el insumo");
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