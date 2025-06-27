import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { DecodedUsuario } from '@/hooks/usuarios/usuario/usePerfilUsuarios';

// Interfaces
export interface Ficha {
  id: number;
  numero_ficha: number;
  nombre_ficha: string;
  abreviacion: string;
  fecha_inicio: string;
  fecha_salida: string;
  is_active: boolean;
}

export interface Rol {
  id: number;
  rol: string;
}

// Interfaz Usuario ajustada para compatibilidad con DecodedUsuario
export interface Usuario {
  id: number;
  user_id?: number; // Para compatibilidad con DecodedUsuario
  identificacion: string;
  email: string;
  nombre: string;
  apellido: string;
  is_active: boolean;
  fk_id_rol: Rol | null;
  rol?: string; // Para compatibilidad con DecodedUsuario
  numero_ficha?: string; // Ajustado a string para DecodedUsuario
  ficha: Ficha | null;
  img: string | null;
  img_url: string;
  password?: string;
  exp?: number; // Para compatibilidad con DecodedUsuario
  iat?: number; // Corregido de iatts a iat
}

// Transforma Usuario a DecodedUsuario para AuthContext
const transformToDecodedUsuario = (user: Usuario): DecodedUsuario => ({
  user_id: user.user_id ?? user.id,
  identificacion: user.identificacion,
  nombre: user.nombre,
  apellido: user.apellido,
  email: user.email,
  rol: user.rol ?? user.fk_id_rol?.rol ?? '',
  numero_ficha: user.numero_ficha ?? user.ficha?.numero_ficha.toString() ?? '',
  img_url: user.img_url,
  exp: user.exp ?? 0,
  iat: user.iat ?? 0,
});

const fetchCurrentUser = async (): Promise<Usuario> => {
  const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');

  // Check if user exists in localStorage and validate required fields
  if (storedUser) {
    try {
      const user = JSON.parse(storedUser);
      if (
        user &&
        'id' in user &&
        'nombre' in user &&
        'apellido' in user &&
        (user.fk_id_rol?.rol || user.rol) // Check for either fk_id_rol or rol
      ) {
        return user as Usuario;
      }
    } catch (error) {
      console.warn('Error parsing stored user:', error);
    }
  }

  if (!token) {
    throw new Error('No se encontró token de autenticación');
  }

  try {
    const response = await fetch(`${apiUrl}/perfil/`, {
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

    // Store the user in localStorage
    localStorage.setItem('user', JSON.stringify(perfil));
    return perfil as Usuario;
  } catch (error: any) {
    throw new Error(`Error fetching user: ${error.message}`);
  }
};

export const useCurrentUser = () => {
  const { usuario, setUsuario } = useAuthContext();

  const query = useQuery<Usuario, Error>({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const user = await fetchCurrentUser();
      if (user && setUsuario) {
        const decodedUser = transformToDecodedUsuario(user);
        setUsuario(decodedUser);
      }
      return user;
    },
    initialData: usuario
      ? {
          id: usuario.user_id,
          identificacion: usuario.identificacion,
          email: usuario.email,
          nombre: usuario.nombre,
          apellido: usuario.apellido,
          is_active: true,
          fk_id_rol: usuario.rol ? { id: 0, rol: usuario.rol } : null,
          rol: usuario.rol,
          numero_ficha: usuario.numero_ficha,
          ficha: usuario.numero_ficha
            ? {
                id: 0,
                numero_ficha: parseInt(usuario.numero_ficha, 10),
                nombre_ficha: '',
                abreviacion: '',
                fecha_inicio: '',
                fecha_salida: '',
                is_active: true,
              }
            : null,
          img: null,
          img_url: usuario.img_url ?? '',
          exp: usuario.exp,
          iat: usuario.iat,
        }
      : undefined,
    enabled: !!localStorage.getItem('token'),
    retry: 1,
    staleTime: 1000 * 60 * 10, // 10 minutes
  });

  useEffect(() => {
    if (query.error) {
      console.error('Query error:', query.error.message);
      if (query.error.message.includes('token')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (setUsuario) {
          setUsuario(null); // Clear user in context
        }
      }
    }
  }, [query.error, setUsuario]);

  return query;
};