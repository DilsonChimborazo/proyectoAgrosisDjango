import { useMutation } from '@tanstack/react-query';
import axios from 'axios';


export interface Asignacion {
  id: number;
  estado: string;
  fecha_programada: string;
  observaciones?: string;
  fk_id_realiza: number | { id: number };
  fk_identificacion: number | { id: number };
}

const actualizarAsignacion = async (asignacion: Asignacion) => {
  const token = localStorage.getItem('token');
  const id = asignacion.id;

  const { data } = await axios.patch(`asignaciones_actividades/${id}/`, asignacion, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  return data;
};

export const useActualizarAsignacion = () => {
  return useMutation({
    mutationFn: actualizarAsignacion,
   
  })}
