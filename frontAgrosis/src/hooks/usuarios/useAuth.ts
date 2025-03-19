import { useState } from "react";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

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
      console.log("Respuesta completa de la API:", data); 


      if (!response.ok) {
        console.error("Error en la autenticación:", response.status);
        throw new Error(data.detail || "Error en la autenticación.");
      }

      if (!data.access) {
        throw new Error("El token de acceso no fue proporcionado por la API.");
      }

      localStorage.setItem("token", data.access);
      console.log("Token de acceso guardado exitosamente:", data.access);

      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
        console.log("Refresh token guardado:", data.refresh);
      }

      return { success: true };
    } catch (err: any) {
      console.error("Error en el proceso de autenticación:", err); 
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    if (typeof localStorage !== "undefined") {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      console.log("Tokens eliminados exitosamente.");
    } else {
      console.warn("localStorage no está disponible.");
    }
  };

  return { login, logout, error };
}

