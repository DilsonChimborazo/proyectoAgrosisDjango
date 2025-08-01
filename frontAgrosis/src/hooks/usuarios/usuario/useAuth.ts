import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const { setUsuario, logout: logoutGlobal } = useAuthContext();

  const login = async (identificacion: string, password: string) => {
    setError(null);
    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      setError("La URL de la API no está definida");
      return { success: false };
    }

  try {
    const token = localStorage.getItem("token"); 
    
    if (!token) {
      throw new Error("No se encontró el token en localStorage");
    }

    const response = await fetch(`${apiUrl}token/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` 
      },
      body: JSON.stringify({ identificacion, password }),
    });

      const data = await response.json();

      if (!response.ok || !data.access) {
        throw new Error(data.detail || "Error en la autenticación.");
      }

      // Guardar tokens
      localStorage.setItem("token", data.access);
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }

      // No es necesario hacer fetch de perfil, ya viene en el token
      // El contexto se encargará de decodificar y establecer el usuario
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUsuario(null); // opcional, ya lo hace el contexto
    logoutGlobal();   // navega fuera y limpia más
  };

  return { login, logout, error };
}