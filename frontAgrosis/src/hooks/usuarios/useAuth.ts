import { useState } from "react";

export function useAuth() {
  const [error, setError] = useState<string | null>(null);

  const login = async (identificacion: string, password: string) => {
    setError(null); 

    try {
      const response = await fetch("http://127.0.0.1:8000/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ identificacion, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en la autenticación");
      }

      localStorage.setItem("token", data.token);
      return { success: true };
    } catch (err: any) {
      setError(err.message);
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
  };

  return { login, logout, error };
}
