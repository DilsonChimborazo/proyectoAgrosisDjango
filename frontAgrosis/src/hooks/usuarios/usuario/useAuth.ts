// src/hooks/useAuth.ts
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
      const response = await fetch(`${apiUrl}token/`, {
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

      // Obtener perfil del usuario usando el token
      const perfilResponse = await fetch(`${apiUrl}perfil/`, {
        headers: {
          Authorization: `Bearer ${data.access}`,
        },
      });

      if (!perfilResponse.ok) {
        throw new Error("No se pudo obtener el perfil del usuario.");
      }

      const perfil = await perfilResponse.json();
      localStorage.setItem("user", JSON.stringify(perfil));
      setUsuario(perfil);

      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    logoutGlobal(); // limpia el contexto + redirige
  };

  return { login, logout, error };
}
