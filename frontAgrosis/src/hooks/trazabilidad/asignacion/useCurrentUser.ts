// src/hooks/auth/useCurrentUser.ts
import { useQuery } from '@tanstack/react-query';
import { useAuthContext } from '@/context/AuthContext';

export interface Ficha {
  id: number;
  numero_ficha: number;
  nombre_ficha: string;
  abreviacion: string;
  fecha_inicio: string;
  fecha_salida: string;
  is_active: boolean;
}
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
  is_active: boolean;
  fk_id_rol: Rol | null; 
  ficha: Ficha | null;
  img: string | null;
  img_url: string
}

const fetchCurrentUser = async (): Promise<Usuario> => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // Si hay un usuario almacenado en localStorage, usarlo
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user.id && user.nombre && user.apellido && user.fk_id_rol?.rol) {
        return user;
      }
    } catch (error) {
      console.warn('Usuario almacenado en localStorage inválido:', error);
    }
  }

  // Si no hay usuario almacenado o es inválido, hacer solicitud al backend
  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  try {
    const response = await fetch(`${apiUrl}perfil/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('No se pudo obtener el perfil del usuario');
    }

    const perfil = await response.json();
    localStorage.setItem('user', JSON.stringify(perfil)); // Actualizar localStorage
    return perfil;
  } catch (error: any) {
    console.error('Error al obtener usuario actual:', error.message);
    throw error;
  }
};

export const useCurrentUser = () => {
  const { usuario, setUsuario } = useAuthContext();

  return useQuery<Usuario, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await fetchCurrentUser();
      setUsuario(usuario); // Actualizar el contexto
      return user;
    },
    initialData: usuario || undefined, // Usar usuario del contexto como datos iniciales
    enabled: !!localStorage.getItem('token'), // Solo ejecuta si hay token
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutos
    onError: (error) => {
      console.error('Error en useCurrentUser:', error.message);
    },
  });
};