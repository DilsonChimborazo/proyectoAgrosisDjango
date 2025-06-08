import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

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

interface Asignacion {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza:  number;
  fk_identificacion: Usuario;
  recursos_asignados: string ;
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