import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface MovimientoBodegaPayload {
  fk_id_herramientas?: number | number[];
  fk_id_insumo?: number | number[];
  cantidad_herramienta?: number | number[];
  cantidad_insumo?: number | number[];
  fk_id_asignacion?: number | null;
  fecha: string;
  movimiento: "Entrada" | "Salida";
}

export interface Herramientas {
    id: number;
    nombre_h: string;
    cantidad_herramienta: number;
    estado: 'Disponible' | 'Prestado' | 'En reparacion';
}

export interface UnidadMedida {
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';  
    factor_conversion: number;
}

export interface Insumo{
    id: number
    nombre: string
    tipo: string
    precio_unidad: number
    cantidad_insumo: number
    fecha_vencimiento: string
    img: string | null | undefined ;
    fk_unidad_medida: UnidadMedida
    precio_por_base: number; 
}
export interface Asignacion {
    id: number;
    estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
    fecha_programada: string;
    observaciones: string;
    fk_id_realiza: Realiza;
    fk_identificacion: Usuario;
  }
  
  export interface Realiza {
    id: number;
    fk_id_cultivo: Cultivo;
    fk_id_actividad: Actividad;
  }
  
  export interface Cultivo {
    id: number;
    nombre_cultivo: string;
    descripcion: string;
    fk_id_especie: Especie;
  }
  
  export interface Especie {
    id: number;
    nombre_cientifico: string;
    nombre_comun: string;
    descripcion: string;
    fk_id_tipo_cultivo: TipoCultivo;
  }
  
  export interface TipoCultivo {
    id: number;
    nombre: string;
    descripcion: string;
  }
  
  export interface Actividad {
    id: number;
    nombre_actividad: string;
    descripcion: string;
  }
  
  export interface Usuario {
    id: number;
    nombre: string;
    apellido: string;
    email: string;
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
            console.log("Datos enviados a la API:", movimiento);

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
