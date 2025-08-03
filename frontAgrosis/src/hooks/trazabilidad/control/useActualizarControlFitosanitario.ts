import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";


export interface ControlFitosanitario {
    id: number;
    fecha_control: string;
    duracion: number;
    descripcion: string;
    tipo_control: string;
    fk_id_plantacion: number;
    fk_id_pea: number;
    fk_id_insumo: number;
    cantidad_insumo: number;
    fk_unidad_medida: number | null;
    fk_identificacion: number[];
    img: File | undefined;
}

export const useActualizarControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (controlActualizado: ControlFitosanitario) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No hay token de autenticación");
            }
            const formData = new FormData();
            formData.append('fecha_control', controlActualizado.fecha_control);
            formData.append('duracion', String(controlActualizado.duracion));
            formData.append('descripcion', controlActualizado.descripcion);
            formData.append('tipo_control', controlActualizado.tipo_control);
            formData.append('fk_id_plantacion', String(controlActualizado.fk_id_plantacion));
            formData.append('fk_id_pea', String(controlActualizado.fk_id_pea));
            formData.append('fk_id_insumo', String(controlActualizado.fk_id_insumo));
            formData.append('cantidad_insumo', String(controlActualizado.cantidad_insumo));
            formData.append('fk_unidad_medida', String(controlActualizado.fk_unidad_medida ?? 0));
            controlActualizado.fk_identificacion.forEach((id, index) => {
                formData.append(`fk_identificacion[${index}]`, String(id));
            });
            if (controlActualizado.img) {
                formData.append('img', controlActualizado.img);
            }

            try {
                const { data } = await axios.put(
                    `/api/control_fitosanitario/${controlActualizado.id}/`,
                    formData,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return data;
            } catch (error: any) {
                console.error("Error completo del backend:", error.response?.data || error.message);
                throw new Error(
                    error.response?.data?.detail ||
                    JSON.stringify(error.response?.data) ||
                    "Error al actualizar el control fitosanitario"
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["controlFitosanitario"] });
        },
    });
};