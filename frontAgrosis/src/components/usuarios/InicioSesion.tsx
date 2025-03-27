import { useState } from "react";
import { Eye, EyeOff, Facebook, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logoAgrosis from "../../../public/logo_proyecto-removebg-preview.png";
import logoSena from "../../../public/logoSena.png";

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identificacion, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        setError("Usuario no registrado o contraseña incorrecta.");
        return;
      }

      localStorage.setItem("token", data.access);
      if (data.refresh) localStorage.setItem("refreshToken", data.refresh);
      if (data.user) localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/principal");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white relative">
      <div className="flex w-3/5 h-4/5 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Sección izquierda con formulario */}
        <div className="w-1/2 flex flex-col justify-center p-8 bg-white">
          {/* Logo del SENA junto a AgroSIS */}
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src={logoSena} alt="SENA" className="w-12" />
            <h2 className="text-2xl font-bold text-gray-700">AGROSIS</h2>
          </div>
          <p className="text-center text-gray-500 mb-6">¡Bienvenido!</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="number"
              placeholder="Identificacion"
              value={identificacion}
              onChange={(e) => setIdentificacion(e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 border rounded-md"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
            <p className="text-sm text-gray-500 text-center">
              ¿Olvidaste tu contraseña?{" "}
              <a href="/solicitarRecuperacion" className="text-green-600">
                Recupérala aquí
              </a>
            </p>
            <p className="text-sm text-gray-500 text-center">
              ¿No estás registrado?{" "}
              <a href="/register" className="text-green-600">
                Regístrate aquí
              </a>
            </p>
            <button type="submit" className="w-full py-2 bg-green-600 text-white rounded-md">
              Iniciar sesión
            </button>
          </form>
        </div>

        {/* Sección derecha con logo y botones de redes sociales */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-6">
          <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
          {/* Redes sociales debajo del logo */}
          <div className="flex space-x-4 mt-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 p-3 rounded-full text-white shadow-md">
              <Facebook size={24} />
            </a>
            <a href="https://wa.me/" target="_blank" rel="noopener noreferrer" className="bg-green-600 p-3 rounded-full text-white shadow-md">
              <MessageCircle size={24} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
