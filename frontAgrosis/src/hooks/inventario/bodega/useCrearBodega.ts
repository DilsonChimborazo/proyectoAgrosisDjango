import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';


interface Usuario {
  id: number;
  identificacion: string;
  email: string;
  nombre: string;
  apellido: string;
  is_active: boolean;
  fk_id_rol: number | null;
  ficha: number | null;
  img: string | null;
  img_url: string;
}

interface ItemSeleccionado {
  id: number;
  cantidad: number;
}

interface RecursosAsignados {
  herramientas?: ItemSeleccionado[];
  insumos?: ItemSeleccionado[];
}

interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza:  number;
  fk_identificacion: Usuario;
  recursos_asignados: (string | RecursosAsignados)[];
}
export interface UnidadMedida {
    id: number;
    nombre_medida: string;
    unidad_base: 'g' | 'ml' | 'u';  
    factor_conversion: number;
}

export interface Insumo{
    id: number
    nombre: string
    tipo: string
    precio_unidad: number
    cantidad_insumo: number | 0;
    cantidad_en_base: string | null;
    fecha_vencimiento: string
    img: string | null | undefined ;
    fk_unidad_medida: UnidadMedida
    es_compuesto: boolean;
    precio_por_base: number;
    tipoEnglis: string
}

export interface Herramientas{
    id: number;
    nombre_h: string;
    cantidad_herramienta: number;
    estado: 'Disponible' | 'Prestado' | 'En reparacion';
    precio: number;
}

interface MovimientoHerramienta {
  id: number;
  cantidad: number;
}

interface MovimientoInsumo {
  id: number;
  cantidad: number;
}

interface MovimientoBodegaPayload {
  fk_id_asignacion: number | Asignacion | null ;
  fecha: string;
  movimiento: 'Entrada' | 'Salida';
  herramientas?: MovimientoHerramienta[];
  insumos?: MovimientoInsumo[];
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

      const response = await axios.post(`/api/bodega/`, payload, {
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