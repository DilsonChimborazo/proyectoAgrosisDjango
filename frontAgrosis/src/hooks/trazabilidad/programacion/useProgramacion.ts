import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Programacion {
  fk_id_asignacionActividades: number;
  fecha_realizada: string;
  duracion: number;
  cantidad_insumo: number;
  img: File | null;
  fk_unidad_medida: number;
}

const fetchProgramaciones = async (): Promise<Programacion[]> => {
  const token = localStorage.getItem('token');
  const { data } = await axios.get(`${apiUrl}programaciones/`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });
  return data.map((p: any) => ({ ...p, img: p.img ? new File([], p.img) : null })); // Convert img to File if needed
};

export const useProgramacion = () => {
  return useQuery<Programacion[], Error>({
    queryKey: ['programaciones'],
    queryFn: fetchProgramaciones,
  });
};