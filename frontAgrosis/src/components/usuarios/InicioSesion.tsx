import { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import { Eye, EyeOff, Mail } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Correo:", email, "Contraseña:", password);
    navigate("/principal");
  };

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
        {/* Logo */}
        <div className="flex justify-center mb-4">
          <img src="../../public/logo_proyecto-removebg-preview.png" alt="Logo" width={180} />
        </div>

        <h2 className="mb-4 text-center text-2xl font-semibold text-gray-700">
          Iniciar Sesión
        </h2>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Email */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Correo Electrónico</label>
            <Input
              type="email"
              className="w-full rounded border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
              placeholder="usuario@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              endContent={<Mail size={20} className="text-gray-400" />}
              required
            />
          </div>

          {/* Campo Contraseña */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-600">Contraseña</label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                className="w-full rounded border border-gray-300 p-2 focus:border-green-500 focus:outline-none"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                endContent={
                  <button type="button" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff size={20} className="text-gray-400" /> : <Eye size={20} className="text-gray-400" />}
                  </button>
                }
                required
              />
            </div>
          </div>

          {/* Botón de inicio de sesión */}
          <Button
            type="submit"
            className="w-full bg-green-600 px-4 py-2 text-white rounded-md hover:bg-green-700 transition-all"
          >
            Iniciar sesión
          </Button>
        </form>

        {/* Enlace de recuperación de contraseña */}
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-gray-600 hover:text-green-600">
            ¿Olvidaste tu contraseña?
          </a>
        </div>

        {/* Logo SENA en la parte inferior */}
        <div className="mt-6 flex justify-center">
          <img src="../../public/logoSena.png" alt="SENA" className="w-16" />
        </div>
      </div>
    </div>
  );
}
