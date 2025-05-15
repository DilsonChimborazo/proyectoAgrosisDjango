import { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../hooks/usuarios/usuario/usePerfilUsuarios';

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const syncUsuario = () => {
      const stored = localStorage.getItem('user');
      setUsuario(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('storage', syncUsuario);
    return () => window.removeEventListener('storage', syncUsuario);
  }, []);

  // Cada vez que el usuario cambia, se guarda en localStorage
  useEffect(() => {
  if (usuario) {
    // Primero, eliminar cualquier posible duplicado en el localStorage
    localStorage.removeItem('user');
    localStorage.setItem('user', JSON.stringify(usuario));
  } else {
    localStorage.removeItem('user');
  }
  setLoading(false); // Una vez que se haya establecido el usuario, podemos dejar de mostrar "loading"
}, [usuario]);

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con tu propio componente de carga
  }

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>');
  }
  return context;
};
