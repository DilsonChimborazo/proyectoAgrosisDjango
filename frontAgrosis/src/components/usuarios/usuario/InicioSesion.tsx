import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Eye, EyeOff, Facebook } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "@/hooks/validaciones/useCustomForm";
import { loginSchema, LoginData } from "@/hooks/validaciones/useSchemas"; 
import logoAgrosis from "../../../../public/def_AGROSIS_LOGOTIC4.png";
import logoSena from "../../../../public/logoSena.png";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();



  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(loginSchema, {
    identificacion: "",
    password: "",
  });

  const onSubmit = async (data: LoginData) => {
    setError(null);

    try {
      const response = await fetch(`/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const responseData = await response.json();
      if (!response.ok) {
        setError("Usuario no registrado o contraseña incorrecta.");
        return;
      }

      localStorage.setItem("token", responseData.access);
      if (responseData.refresh) localStorage.setItem("refreshToken", responseData.refresh);
      await queryClient.invalidateQueries({ queryKey: ['perfilusuario'] });
      navigate("/principal");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="relative w-screen h-screen">
    {/* Fondo de imagen */}
    <img
      src="/fondo.jpg"
      alt="Fondo"
      className="absolute inset-0 w-full h-full object-cover z-0"
    />

    {/* Capa oscura sobre el fondo */}
    <div className="absolute inset-0 bg-black opacity-70 z-10"></div>

    {/* Contenido */}
    <div className="relative z-20 flex h-full w-full items-center justify-center ">
      <div className="flex flex-col md:flex-row w-11/12 md:w-3/5 h-auto md:h-4/5 backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl rounded-3xl overflow-hidden">
        
        {/* Sección izquierda - Formulario */}
        <div className="w-full md:w-1/2 flex flex-col justify-center p-8">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src={logoSena} alt="SENA" className="w-12" />
            <h2 className="text-2xl font-bold text-gray-300">AGROSOFT</h2>
          </div>
          <p className="text-center text-gray-300 mb-6">¡Bienvenido!</p>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 login-register">
            <div>
              <input
                type="text"
                placeholder="Identificación"
                {...register("identificacion")}
                className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
              />
              {errors.identificacion && (
                <p className="text-red-400 text-sm">{errors.identificacion.message}</p>
              )}
            </div>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                {...register("password")}
                className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-4 flex items-center text-white"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
              {errors.password && (
                <p className="text-red-400 text-sm">{errors.password.message}</p>
              )}
            </div>

            <p className="text-sm text-gray-300 text-center">
              ¿Olvidaste tu contraseña?{" "}
              <a href="/solicitarRecuperacion" className="text-green-400 underline">
                Recupérala aquí
              </a>
            </p>
            <p className="text-sm text-gray-300 text-center">
              ¿No estás registrado?{" "}
              <a href="/register" className="text-green-400 underline">
                Regístrate aquí
              </a>
            </p>

            <button
              type="submit"
              className="w-full py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-full"
            >
              Iniciar sesión
            </button>
          </form>
        </div>

        <div className="hidden md:block w-[1px] bg-white/30 h-4/5 self-center"></div>

        {/* Sección derecha - Logo + redes */}
        <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
          <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
          <div className="flex space-x-4 mt-4">
            <a
              href="https://www.facebook.com/SENAHuila?__tn__=%2Cd"
              target="_blank"
              title="Facebook"
              rel="noopener noreferrer"
              className="bg-blue-600 p-3 rounded-full text-white shadow-md hover:bg-blue-700 transition-colors"
            >
              <Facebook size={24} />
            </a>
            
            <a
              href="https://r.search.yahoo.com/_ylt=AwrE_3o4SEpoCgIApGWrcgx.;_ylu=Y29sbwNiZjEEcG9zAzEEdnRpZAMEc2VjA3Ny/RV=2/RE=1750908217/RO=10/RU=https%3a%2f%2foferta.senasofiaplus.edu.co%2fsofia-oferta%2f/RK=2/RS=TmHDuEeQUtEAKLd3xLFqMDjcRvI-"
              title="Sofia plus"
            >
              <img src="/logoSena.png" alt="" className="w-10 h-10" />
            </a>
            <a
              href={import.meta.env.VITE_DOC_URL}
              title="Documentación Agrosoft"
            >
              <img
                src="/logo-doc.png"
                alt="Documentación Agrosoft"
                className="w-10 h-5 "
              />
            </a>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}