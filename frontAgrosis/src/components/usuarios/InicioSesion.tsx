import { useState } from "react";
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

      if (!response.ok) {
        if (data.detail === "No active account found with the given credentials") {
          setError("Usuario no registrado o contraseña incorrecta.");
        } else {
          setError(data.detail || "Error en la autenticación.");
        }
        return;
      }

      if (!data.access) {
        throw new Error("El token de acceso no fue proporcionado por la API.");
      }

      localStorage.setItem("token", data.access);

      if (data.refresh) {
        localStorage.setItem("refreshToken", data.refresh);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      } else {
        console.warn("⚠ No se recibió información del usuario.");
      }
      navigate("/principal");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-green-300 to-green-600 opacity-50"></div>
      <div className="absolute inset-0 bg-[url('/waves.svg')] bg-cover opacity-30"></div>

      <div className="relative z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center mb-6">
          <img
            src="../../public/logo_proyecto-removebg-preview.png"
            alt="Logo"
            className="w-28 h-auto drop-shadow-md"
          />
        </div>

        <h2 className="text-5xl font-extrabold text-center text-green-700">
          Bienvenido!
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Inicia sesión para continuar.
        </p>

        {error && (
          <p className="text-red-500 text-center mb-4 font-semibold">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="identificacion"
              className="block text-sm font-medium text-gray-700"
            >
              Identificación
            </label>
            <input
              id="identificacion"
              type="text"
              placeholder="Tu identificación"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              required
              className="w-full px-4 py-3 mt-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Contraseña
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 mt-2 border rounded-xl shadow-sm focus:ring-2 focus:ring-green-400 focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white bg-green-600 rounded-xl hover:bg-green-700 transition-all font-semibold shadow-md"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <a
            href="/register"
            className="font-semibold text-green-500 hover:text-green-700 transition-all"
          >
            Regístrate aquí
          </a>
        </p>
      </div>
    </div>
  );
}
