import { useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);
  const { setUsuario, logout: logoutGlobal } = useAuthContext();

  const login = async (identificacion: string, password: string) => {
    setError(null);

    try {
      const response = await fetch('/api/token/', {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identificacion, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.access) {
        throw new Error(data.detail || "Error en la autenticación.");
      }

      localStorage.setItem("token", data.access);
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }

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