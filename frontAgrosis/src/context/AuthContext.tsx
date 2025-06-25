// src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { jwtDecode } from "jwt-decode";

// Define el tipo esperado de los datos que vienen en el token JWT
interface DecodedUsuario {
  user_id: number;
  identificacion: string;
  nombre: string;
  apellido: string;
  email: string;
  rol: string;
  numero_ficha: string;
  img_url?: string;
  exp: number;
  iat: number;
}

interface AuthContextType {
  usuario: DecodedUsuario | null;
  setUsuario: (usuario: DecodedUsuario | null) => void;
  loading: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [usuario, setUsuario] = useState<DecodedUsuario | null>(null);
  const [loading, setLoading] = useState(true);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setUsuario(null);
    navigate('/');
  };

  const decodificarToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const decoded: DecodedUsuario = jwtDecode(token);
      const ahora = Math.floor(Date.now() / 1000);
      if (decoded.exp < ahora) {
        logout(); // Token expirado
        return null;
      }
      return decoded;
    } catch (err) {
      console.error("Error al decodificar token:", err);
      logout();
      return null;
    }
  };

  useEffect(() => {
    const rutasPublicas = ['/', '/register', '/solicitarRecuperacion'];
    const esRutaPublica = rutasPublicas.includes(location.pathname);

    const usuarioDecodificado = decodificarToken();
    setUsuario(usuarioDecodificado);

    if (!usuarioDecodificado && !esRutaPublica) {
      logout();
    }

    setLoading(false);
  }, [location.pathname]);

  // Sincronizar entre pestañas
  useEffect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === 'token') {
        const nuevoUsuario = decodificarToken();
        setUsuario(nuevoUsuario);
        if (!nuevoUsuario) logout();
      }
    };

    window.addEventListener('storage', syncStorage);
    return () => window.removeEventListener('storage', syncStorage);
  }, []);

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
