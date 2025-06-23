import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCrearBodega } from "@/hooks/inventario/bodega/useCrearBodega";

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
    cantidad_a_sumar?: number; 
    fecha_vencimiento?: string | null;
    img?: File | null;
    fk_unidad_medida: UnidadMedida | number;
}

export const useActualizarInsumos = () => {
    const queryClient = useQueryClient();
    const crearMovimientoBodega = useCrearBodega();

    return useMutation({
        mutationFn: async (insumoActualizado: Insumo) => {
            const { id, fk_unidad_medida, cantidad_a_sumar = 0, ...datos } = insumoActualizado;

            // Validación de campos
            if (
                !datos.nombre.trim() ||
                !datos.tipo.trim() ||
                datos.precio_unidad < 0 ||
                cantidad_a_sumar < 0 ||
                !datos.fecha_vencimiento
            ) {
                throw new Error("⚠️ Datos inválidos. Verifica los campos del insumo.");
            }

            const token = localStorage.getItem("token");
            if (!token) throw new Error("⚠️ Token de autenticación no encontrado.");

            // Obtener la cantidad actual del insumo
            const insumoActual = await axios.get(`${apiUrl}insumo/${id}/`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            const cantidadActual = insumoActual.data.cantidad_insumo || 0;
            const nuevaCantidad = cantidadActual + cantidad_a_sumar;

            // Crear FormData
            const formData = new FormData();
            formData.append("nombre", datos.nombre);
            formData.append("tipo", datos.tipo);
            formData.append("precio_unidad", String(datos.precio_unidad));
            formData.append("cantidad_insumo", String(nuevaCantidad));
            formData.append("fecha_vencimiento", datos.fecha_vencimiento || "");

            // Manejo de unidad de medida
            const unidadMedidaId = typeof fk_unidad_medida === "number"
                ? fk_unidad_medida
                : (fk_unidad_medida as any).id || 1;
            formData.append("fk_unidad_medida", String(unidadMedidaId));

            if (datos.img instanceof File) {
                formData.append("img", datos.img);
            }

            try {
                const { data } = await axios.patch(`${apiUrl}insumo/${id}/`, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        "Authorization": `Bearer ${token}`,
                    },
                });
                
                return { ...data, cantidad_a_sumar };
            } catch (error: any) {
                console.error("❌ Error en la solicitud:", error.response?.data || error.message);
                throw new Error(error.response?.data?.detail || "Error al actualizar el insumo");
            }
        },
        onSuccess: (variables) => {
            queryClient.invalidateQueries({ queryKey: ["insumo"] });
            
            // Crear entrada en bodega solo si se agregó cantidad
            if (variables.cantidad_a_sumar && variables.cantidad_a_sumar > 0) {
                crearMovimientoBodega.mutate({
                    fecha: new Date().toISOString().split('T')[0],
                    movimiento: "Entrada",
                    insumos: [{
                        id: variables.id,
                        cantidad: variables.cantidad_a_sumar
                    }],
                    herramientas: []
                });
            }
        },
        onError: (error) => {
            console.error("❌ Error al actualizar el insumo:", error);
        },
    });
};