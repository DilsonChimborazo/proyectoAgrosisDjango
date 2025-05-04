import { useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = 'http://127.0.0.1:8000/api/';

// Interfaz para Programacion
interface Programacion {
  id?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
  fecha_realizada: string; // Formato esperado: YYYY-MM-DD
  duracion: number; // Duración en minutos
  fk_id_asignacionActividades: number;
  cantidad_insumo: number;
  img?: File | string;
  fk_unidad_medida: number;
}

// Hook para crear una programación
export const useCrearProgramacion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (programacion: Programacion) => {
      const formData = new FormData();
      formData.append('estado', programacion.estado);
      formData.append('fecha_realizada', programacion.fecha_realizada);
      formData.append('duracion', programacion.duracion.toString());
      formData.append('fk_id_asignacionActividades', programacion.fk_id_asignacionActividades.toString());
      formData.append('cantidad_insumo', programacion.cantidad_insumo.toString());
      if (programacion.img instanceof File) {
        formData.append('img', programacion.img);
      }
      formData.append('fk_unidad_medida', programacion.fk_unidad_medida.toString());

      return axios.post(`${apiUrl}programaciones/`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
    },
    onSuccess: () => {
      // Invalidar las consultas de programaciones para actualizar la tabla
      queryClient.invalidateQueries({ queryKey: ['programaciones'] });
    },
    onError: (error: any) => {
      console.error('Error al crear programación:', error.response?.data || error.message);
      throw new Error(error.response?.data?.detail || 'No se pudo crear la programación');
    },
  });
};