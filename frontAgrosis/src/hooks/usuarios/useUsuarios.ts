import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL; // Verifica que esta variable esté configurada en tu entorno

// Interfaces
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

// Función para obtener usuarios
const fetchUsuarios = async (): Promise<Usuario[]> => {
  const token = localStorage.getItem("token");
  
  if (!token) {
    throw new Error("No hay token de autenticación");
  }

  try {
    const response = await axios.get(`${apiUrl}usuario/`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Validamos que los datos devueltos sean un array
    if (!Array.isArray(response.data)) {
      throw new Error("La API no devolvió un array válido.");
    }

    console.log("Datos recibidos de la API:", response.data);

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener usuarios:", error.response || error.message);
    throw new Error(
      error.response?.data?.detail || "Error al obtener la lista de usuarios"
    );
  }
};

// Hook para consumir los usuarios
export const useUsuarios = () => {
  return useQuery<Usuario[], Error>({
    queryKey: ['usuarios'],
    queryFn: fetchUsuarios,
    staleTime: 1000 * 60 * 10, // Los datos se consideran frescos por 10 minutos
  });
};
