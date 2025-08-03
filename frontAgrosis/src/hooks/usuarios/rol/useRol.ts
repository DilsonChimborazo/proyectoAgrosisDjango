import { useQuery } from '@tanstack/react-query';
import axios from 'axios';


export interface Rol {
  id?: number;
  rol: string;
  fecha_creacion: string;
}

const fetchRoles = async (): Promise<Rol[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    const response = await axios.get(`/api/rol/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener roles:", {
      mensaje: error.message,
      estado: error.response?.status,
      datos: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener la lista de roles"
    );
  }
};

export const useRoles = () => {
  return useQuery<Rol[], Error>({
    queryKey: ['roles'],
    queryFn: fetchRoles,
    staleTime: 0,
  });
};
