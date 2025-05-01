import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

const apiUrl = import.meta.env.VITE_API_URL;

export interface ControlFitosanitario {
    fecha_control: string;
    duracion: number;
    descripcion: string;
    tipo_control: string;
    fk_id_plantacion: number;
    fk_id_pea: number;
    fk_id_insumo: number;
    cantidad_insumo: number;
    fk_identificacion: number | null;
    img: File;
}

export const useCrearControlFitosanitario = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (nuevoControl: ControlFitosanitario) => {
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No hay token de autenticación");
            }
            const formData = new FormData();
            formData.append('fecha_control', nuevoControl.fecha_control);
            formData.append('duracion', String(nuevoControl.duracion));
            formData.append('descripcion', nuevoControl.descripcion);
            formData.append('tipo_control', nuevoControl.tipo_control);
            formData.append('fk_id_plantacion', String(nuevoControl.fk_id_plantacion));
            formData.append('fk_id_pea', String(nuevoControl.fk_id_pea));
            formData.append('fk_id_insumo', String(nuevoControl.fk_id_insumo));
            formData.append('cantidad_insumo', String(nuevoControl.cantidad_insumo));
            if (nuevoControl.fk_identificacion !== null) {
                formData.append('fk_identificacion', String(nuevoControl.fk_identificacion));
            }
            formData.append('img', nuevoControl.img);
            console.log("FormData enviado al backend:", {
                fecha_control: formData.get('fecha_control'),
                duracion: formData.get('duracion'),
                descripcion: formData.get('descripcion'),
                tipo_control: formData.get('tipo_control'),
                fk_id_plantacion: formData.get('fk_id_plantacion'),
                fk_id_pea: formData.get('fk_id_pea'),
                fk_id_insumo: formData.get('fk_id_insumo'),
                cantidad_insumo: formData.get('cantidad_insumo'),
                fk_identificacion: formData.get('fk_identificacion'),
                img: formData.get('img'),
            });

            try {
                const { data } = await axios.post(`${apiUrl}control_fitosanitario/`, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                return data;
            } catch (error: any) {
                console.error("Error completo del backend:", error.response?.data || error.message);
                throw new Error(
                    error.response?.data?.detail ||
                    JSON.stringify(error.response?.data) ||
                    "Error al crear el control fitosanitario"
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["controlFitosanitario"] });
        },
    });
};