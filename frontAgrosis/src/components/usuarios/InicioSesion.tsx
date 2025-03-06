import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [identificacion, setIdentificacion] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const apiUrl = import.meta.env.VITE_API_URL;

    if (!apiUrl) {
      setError("La URL de la API no está definida");
      return;
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
      console.log("Respuesta completa de la API:", data); // Depuración

      if (!response.ok) {
        throw new Error(data.detail || "Error en la autenticación");
      }

      // Utiliza el campo `access` como token principal
      if (!data.access) {
        throw new Error("El token de acceso no fue proporcionado por la API.");
      }

      // Guarda el token de acceso en localStorage
      localStorage.setItem("token", data.access);
      console.log("Token de acceso guardado exitosamente:", data.access);

      // Si deseas guardar el refresh token
      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
        console.log("Refresh token guardado:", data.refresh);
      }

      navigate("/principal");
    } catch (err: any) {
      console.error("Error en el inicio de sesión:", err); // Depuración
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img
            src="../../public/logo_proyecto-removebg-preview.png"
            alt="Logo"
            width={180}
          />
        </div>

        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">
          Iniciar Sesión
        </h2>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Identificación
            </label>
            <Input
              type="text"
              placeholder="Tu identificación"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">
              Contraseña
            </label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                }
                required
              />
            </div>
          </div>

          <Button type="submit">Iniciar sesión</Button>
        </form>
      </div>
    </div>
  );
}
