import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react'; // Importar useEffect desde 'react'
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
  img_url: string;
  password?: string; // Añadido como opcional para compatibilidad
}

const fetchCurrentUser = async (): Promise<Usuario> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (user && 'id' in user && 'nombre' in user && 'apellido' in user && user.fk_id_rol?.rol) {
        return user as Usuario;
      }
    } catch (error) {
    }
  }

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
      throw new Error(`No se pudo obtener el perfil del usuario: ${response.statusText}`);
    }

    const perfil = await response.json();
    if (!perfil || typeof perfil !== 'object' || !('id' in perfil)) {
      throw new Error('Respuesta del servidor no válida');
    }
    localStorage.setItem('user', JSON.stringify(perfil));
    return perfil as Usuario;
  } catch (error: any) {
    throw error;
  }
};

export const useCurrentUser = () => {
  const { usuario, setUsuario } = useAuthContext();

  const query = useQuery<Usuario, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await fetchCurrentUser();
      if (user && setUsuario) {
        setUsuario(user);
      }
      return user;
    },
    initialData: usuario ? () => usuario : undefined,
    enabled: !!localStorage.getItem('token'),
    retry: 1,
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (query.error) {
      if (query.error.message.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }
  }, [query.error]);

  return query;
};