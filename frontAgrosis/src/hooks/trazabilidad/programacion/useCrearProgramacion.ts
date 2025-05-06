import { useMutation } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: number;
  cantidad_insumo?: number;
  img?: string;
  fk_unidad_medida?: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

const crearProgramacion = async (formData: FormData) => {
  const token = localStorage.getItem('token');

  // Validar que los valores necesarios estén presentes en FormData
  const requiredFields = ['fk_id_asignacionActividades', 'fecha_realizada', 'duracion', 'cantidad_insumo', 'fk_unidad_medida'];
  for (const field of requiredFields) {
    if (!formData.get(field)) {
      throw new Error(`El campo ${field} es requerido`);
    }
  }

  const response = await axios.post(`${apiUrl}programaciones/`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });

  const data = response.data;

  // Validar la respuesta del servidor
  if (!data || typeof data !== 'object') {
    throw new Error('Respuesta inválida del servidor');
  }

  // Asegurarse de que no se llame .toString() sobre valores undefined
  return data as Programacion;
};

export const useCrearProgramacion = () => {
  return useMutation({
    mutationFn: crearProgramacion,
    onError: (error: any) => {
      console.error('Error al crear programación:', error.message);
    },
  });
};