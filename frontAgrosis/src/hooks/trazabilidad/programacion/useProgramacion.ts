// src/hooks/trazabilidad/programacion/useProgramacion.ts
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada: string;
  duracion: number;
  cantidad_insumo: number;
  img: string | null; // Aseguramos que img es una URL
  fk_unidad_medida: number;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

const fetchProgramaciones = async (): Promise<Programacion[]> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}programaciones/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data; // Devolvemos los datos tal cual, con img como URL desde el backend
};

export const useProgramacion = () => {
  return useQuery<Programacion[], Error>({
    queryKey: ['programaciones'],
    queryFn: fetchProgramaciones,
  });
};