import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Herramientas {
    id: number;
    nombre_h: string;
    cantidad: number;
    estado: 'Disponible' | 'Prestado' | 'En reparacion';
}

export interface UnidadMedida {
    id: number;
    nombre_medida: string;
    abreviatura: string;
}

export interface Insumos {
    id: number;
    nombre: string;
    tipo: string;
    precio_unidad: number;
    cantidad: number;
    fecha_vencimiento: string;
    img: string;
    fk_unidad_medida: UnidadMedida;
}

export interface Asignacion {
    estado: string;
    fecha_programada: string;
    observaciones: string;
    fk_id_realiza: number | null;
    fk_identificacion: number | null;
}

export interface Bodega {
    id: number;
    fk_id_herramientas: Herramientas | null;
    fk_id_insumo: Insumos | null;
    fk_id_asignacion: Asignacion | null;
    cantidad: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
}

export const useCrearBodega = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movimiento: Bodega) => {
            const token = localStorage.getItem("token");

            if (!token) {
                throw new Error("No se ha encontrado un token de autenticación");
            }

            try {
                const response = await axios.post(
                    `${apiUrl}bodega/`,  // Asegúrate de que la URL es correcta
                    movimiento,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return response.data;  // Asegúrate de devolver los datos correctos
            } catch (error: any) {
                const message = error.response?.data?.message || error.message || "Error desconocido";
                throw new Error(message);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodega"] });
        },
        onError: (error: any) => {
            console.error("Error al registrar el movimiento en la bodega:", error.message);
        },
    });
};
