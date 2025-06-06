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

const fetchSalario = async (): Promise<Salario[]> => {
  const token = localStorage.getItem("token");
  if (!token) {
    console.error("Error: No se ha encontrado un token de autenticación");
    throw new Error("No se ha encontrado un token de autenticación");
  }

  try {
    const { data } = await axios.get<Salario[]>(`${apiUrl}salario/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error al obtener los datos de salario:", error.response?.data || error.message);
      throw new Error(error.response?.data?.message || "No se pudo obtener la lista de salarios");
    } else {
      console.error("Error al obtener los datos de salario:", error);
      throw new Error("No se pudo obtener la lista de salarios");
    }
  }
};

// Hook para usar en los componentes
export const useSalario = () => {
  return useQuery<Salario[], Error>({
    queryKey: ['salario'],
    queryFn: fetchSalario,
    staleTime: 1000 * 60 * 10, 
  });
};