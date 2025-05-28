import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Rol {
  id: number;
  rol: string;
}
export interface Salario {
  id: number;
  fk_id_rol: Rol;
  precio_jornal: number;
  horas_por_jornal: number;
  fecha_inicio: string;
  fecha_fin: string;
  activo: boolean;

}

// Función para obtener la lista de producción
const fetchSalario = async (): Promise<Salario[]> => {
  try {
    const { data } = await axios.get<Salario[]>(`${apiUrl}salario/`);
    return data;
  } catch (error) {
    console.error("Error al obtener los datos de producción:", error);
    throw new Error("No se pudo obtener la lista de producción");
  }
};

// Hook para usar en los componentes
export const useSalario = () => {
  return useQuery<Salario[], Error>({
    queryKey: ['salario'],
    queryFn: fetchSalario,
    staleTime: 1000 * 60 * 10, // 10 minutos de cache
  });
};