import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

interface MovimientoHerramienta {
  id: number;
  cantidad: number;
}

interface MovimientoInsumo {
  id: number;
  cantidad: number;
}

interface MovimientoBodegaPayload {
  fk_id_asignacion: number | null;
  fecha: string;
  movimiento: 'Entrada' | 'Salida';
  herramientas?: MovimientoHerramienta[];
  insumos?: MovimientoInsumo[];
}

export interface Herramientas {
  id: number;
  nombre_h: string;
  cantidad_herramienta: number;
  estado: 'Disponible' | 'Prestado' | 'En reparacion';
}

export interface UnidadMedida {
  id: number;
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
  cantidad_en_base: string | null;
  fecha_vencimiento: string;
  img: string | null;
  fk_unidad_medida: UnidadMedida;
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

      const payload = {
        fk_id_asignacion: movimiento.fk_id_asignacion,
        fecha: movimiento.fecha,
        movimiento: movimiento.movimiento,
        herramientas: movimiento.herramientas || [],
        insumos: movimiento.insumos || [],
      };

      // Validación: requiere al menos una herramienta o un insumo
      if (payload.herramientas.length === 0 && payload.insumos.length === 0) {
        throw new Error("Debe incluir al menos una herramienta o un insumo");
      }

      console.log("Payload final a enviar:", payload);

      const response = await axios.post(`${apiUrl}bodega/`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bodega"] });
      queryClient.invalidateQueries({ queryKey: ["insumos"] });
      queryClient.invalidateQueries({ queryKey: ["herramientas"] });
    },
    onError: (error: any) => {
      console.error("Error detallado al registrar en bodega:", {
        status: error.response?.status,
        data: error.response?.data,
        request: error.config?.data,
      });
      throw error;
    },
  });
};