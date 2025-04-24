// src/hooks/inventario/bodega/useCrearBodega.ts

import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface MovimientoBodegaPayload {
    fk_id_herramientas: number | null;
    fk_id_insumo: number | null;
    fk_id_asignacion: number | null;
    cantidad: number;
    fecha: string;
    movimiento: 'Entrada' | 'Salida';
}

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

export const useCrearBodega = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: async (movimiento: MovimientoBodegaPayload) => {
            const token = localStorage.getItem("token");
            if (!token) throw new Error("No se ha encontrado un token de autenticación");

            const response = await axios.post(
                `${apiUrl}bodega/`,
                movimiento,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["bodega"] });
        },
        onError: (error: any) => {
            console.error("Error al registrar el movimiento en la bodega:", error.message);
        },
    });
};
