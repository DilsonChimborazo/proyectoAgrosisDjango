import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

// Definición de interfaces para los datos relacionados
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

// Interfaz para los datos enviados al editar una asignación (PUT)
export interface EditarAsignacionDTO {
  id: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_programada: string;
  observaciones: string;
  fk_id_realiza: number;
  fk_identificacion: number;
}

// Función para editar una asignación con manejo de errores
const editarAsignacion = async (asignacionData: EditarAsignacionDTO): Promise<Asignacion> => {
  try {
    const response = await axios.put(`${apiUrl}/asignaciones_actividades/${asignacionData.id}/`, asignacionData);
    console.log("Asignación editada exitosamente:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al editar asignación:", error.response?.data || error.message);
    throw new Error("No se pudo editar la asignación");
  }
};

export const useEditarAsignacion = () => {
  const queryClient = useQueryClient();

  return useMutation<Asignacion, Error, EditarAsignacionDTO>({
    mutationFn: editarAsignacion,
    onSuccess: () => {
      // Invalidar la consulta de asignaciones para recargar la lista
      queryClient.invalidateQueries({ queryKey: ['Asignaciones'] });
    },
  });
};