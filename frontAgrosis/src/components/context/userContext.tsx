import React, { createContext, useState, useEffect, ReactNode } from 'react';
import axios, { AxiosError } from 'axios';

// Definir la interfaz para los datos del perfil
interface Perfil {
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  img_url?: string;
  fk_id_rol?: { rol: string };
  ficha?: { numero_ficha: string };
}

// Definir la interfaz para el contexto
interface UserContextType {
  perfil: Perfil | null;
  isLoading: boolean;
  error: AxiosError | null;
  updatePerfil: (formData: FormData) => Promise<void>;
  isUpdating: boolean;
}

// Crear el contexto
const UserContext = createContext<UserContextType | undefined>(undefined);

// Interfaz para las props del proveedor
interface UserProviderProps {
  children: ReactNode;
}

// Proveedor del contexto
export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [perfil, setPerfil] = useState<Perfil | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<AxiosError | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Cargar el perfil inicial de forma asincrónica
  useEffect(() => {
    const fetchPerfil = async () => {
      try {
        const usuarioGuardado = localStorage.getItem('user');
        if (usuarioGuardado) {
          setPerfil(JSON.parse(usuarioGuardado));
        }
        const response = await axios.get('http://localhost:8000/api/usuario');
        setPerfil(response.data);
        localStorage.setItem('user', JSON.stringify(response.data)); // Actualizar localStorage
      } catch (err) {
        setError(err as AxiosError);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPerfil();
  }, []);

  // Actualizar el perfil de forma asincrónica
  const updatePerfil = async (formData: FormData) => {
    setIsUpdating(true);
    try {
      const response = await axios.put('http://localhost:8000/api/usuario', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setPerfil(response.data); // Actualizar el estado
      localStorage.setItem('user', JSON.stringify(response.data)); // Actualizar localStorage
    } catch (err) {
      setError(err as AxiosError);
      throw err;
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <UserContext.Provider value={{ perfil, isLoading, error, updatePerfil, isUpdating }}>
      {children}
    </UserContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useUserContext = () => {
  const context = React.useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext debe usarse dentro de un UserProvider');
  }
  return context;
};