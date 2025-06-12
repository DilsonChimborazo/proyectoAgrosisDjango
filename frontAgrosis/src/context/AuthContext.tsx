import { createContext, useContext, useState, useEffect } from 'react';
import { Usuario } from '../hooks/usuarios/usuario/usePerfilUsuarios';
import { Spinner } from "@heroui/react";
import { useNavigate, useLocation } from 'react-router-dom';

interface AuthContextType {
  usuario: Usuario | null;
  setUsuario: (usuario: Usuario | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export default function LoadingBox() {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white bg-opacity-90 z-50">
      <div className="bg-white shadow-lg rounded-2xl border border-green-200 p-6 flex flex-col items-center space-y-4">
        <Spinner color="success" labelColor="success" />
        <p className="text-sm text-gray-600">Por favor, espera un momento.</p>
      </div>
    </div>
  );
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUsuario(null);
    navigate('/');
  };

  // Sincronizar usuario entre pestañas
  useEffect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === 'user') {
        if (event.newValue) {
          setUsuario(JSON.parse(event.newValue));
        } else {
          logout();
        }
      }

      if (event.key === 'token' && !event.newValue) {
        logout();
      }
    };

    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

  // Guardar usuario en localStorage si cambia
  useEffect(() => {
    if (usuario) {
      localStorage.setItem('user', JSON.stringify(usuario));
    } else {
      localStorage.removeItem('user');
    }
  }, [usuario]);

  // Verificar token al cargar app, solo en rutas privadas
  useEffect(() => {
    const token = localStorage.getItem('token');
    const rutasPublicas = ['/', '/register', '/solicitarRecuperacion'];
    const esRutaPublica = rutasPublicas.includes(location.pathname);

    if (!token && !esRutaPublica) {
      logout();
    }

    setLoading(false);
  }, [location.pathname]);

  

  if (loading) return <LoadingBox />;

  return (
    <AuthContext.Provider value={{ usuario, setUsuario, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext debe usarse dentro de <AuthProvider>');
  }
  return context;
};
