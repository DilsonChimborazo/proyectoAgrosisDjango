import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export interface Rol {
  id: number;
  rol: string;
}

export interface Usuario {
  id: number;
  identificacion: string;
  email: string;
  nombre: string;
  apellido: string;
  fk_id_rol: Rol | null; 
}

const fetchUsuarios = async (): Promise<Usuario[]> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No hay token de autenticación");

    console.log("Token enviado:", token);

    const response = await axios.get(`${apiUrl}usuario/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Datos recibidos de la API:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Error al obtener usuarios:", {
      mensaje: error.message,
      estado: error.response?.status,
      datos: error.response?.data,
    });
    throw new Error(
      error.response?.data?.detail || "No se pudo obtener la lista de usuarios"
    );
  }
};

export const useUsuarios = () => {
  return useQuery<Usuario[], Error>({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
    staleTime: 1000 * 60 * 10, 
  });
};
