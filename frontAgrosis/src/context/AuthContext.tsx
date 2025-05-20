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

  // Sincronizar el usuario entre pestañas
  useEffect(() => {
    const syncUsuario = () => {
      const stored = localStorage.getItem('user');
      setUsuario(stored ? JSON.parse(stored) : null);
    };

    window.addEventListener('storage', syncUsuario);
    return () => window.removeEventListener('storage', syncUsuario);
  }, []);

  // Guardar el usuario en localStorage cuando cambia
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('user');
    }
  }, [usuario]);

  // Establecer loading como false al montar
  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Puedes reemplazar esto con un spinner personalizado si deseas
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
