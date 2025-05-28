import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Facebook, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "@/hooks/validaciones/useCustomForm";
import { registroSchema, RegistroData } from "@/hooks/validaciones/useSchemas"; 
import logoAgrosis from "../../../../public/def_AGROSIS_LOGOTIC4.png";
import logoSena from "../../../../public/logoSena.png";
import { showToast } from "@/components/globales/Toast";
import LoadingBox from "@/context/AuthContext";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useCustomForm(registroSchema, {
    identificacion: "",
    email: "",
    nombre: "",
    apellido: "",
    password: "",
    fk_id_rol: "",
  });

  const onSubmit = async (data: RegistroData) => {
    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      showToast({
          title: 'Error en el servidor',
          description: 'No se pudo conectar al servidor, contacta a soporte',
          variant: 'error'
        });
      return;
    }

    try {
      setLoading(true);
      const dataToSend = {
        ...data,
        fk_id_rol: parseInt(data.fk_id_rol), // Convertimos a número para la API
      };

      const response = await axios.post(`${apiUrl}usuario/`, dataToSend, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.status === 201) {
        showToast({
          title: 'Registro exitoso',
          description: 'Administrador registrado correctamente',
          variant: 'success'
        });
        setTimeout(() => navigate("/"), 1000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (typeof errorData === "object" && !errorData.detail) {
          showToast({
            title: 'Error en el registro',
            description: "Error al registrar el usuario ya existe un administrador",
            variant: 'error'
          });
        } else {
          showToast({
            title: 'Error en el registro',
            description: "Ya existe un administrador!",
            variant: 'error'
          });
        }
      } else {
        showToast({
          title: 'Error inesperado',
          description: 'Por favor, intenta de nuevo.',
          variant: 'error'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 1, nombre: "Administrador" },
  ];

  return (
    <div className="relative w-screen min-h-screen overflow-hidden">
      <img
        src="/fondo.jpg"
        alt="Fondo"
        className="absolute inset-0 w-full h-full object-cover z-0"
      />
      <div className="absolute inset-0 bg-black opacity-70 z-10"></div>
      <div className="relative z-20 flex min-h-screen w-full items-center justify-center p-4">
        <div className="flex flex-col md:flex-row w-full max-w-4xl h-auto md:h-[80vh] backdrop-blur-md bg-white/10 border border-white/20 text-white shadow-2xl rounded-3xl overflow-hidden">
          <div className="w-full md:w-1/2 flex flex-col justify-center p-8 overflow-auto">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <img src={logoSena} alt="SENA" className="w-12" />
              <h2 className="text-2xl font-bold text-gray-300">AGROSOFT</h2>
            </div>
            <p className="text-center text-gray-300 mb-6">¡Registra tu Superadmin!</p>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 login-register">
              <div>
                <input
                  type="text"
                  placeholder="Identificación"
                  {...register("identificacion")}
                  className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
                />
                {errors.identificacion && (
                  <p className="text-red-500 text-sm">{errors.identificacion.message}</p>
                )}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Correo"
                  {...register("email")}
                  className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
                />
                {errors.email && (
                  <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Nombre"
                  {...register("nombre")}
                  className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
                />
                {errors.nombre && (
                  <p className="text-red-500 text-sm">{errors.nombre.message}</p>
                )}
              </div>
              <div>
                <input
                  type="text"
                  placeholder="Apellido"
                  {...register("apellido")}
                  className="w-full px-4 py-2 bg-transparent border-b border-white placeholder-white focus:outline-none"
                />
                {errors.apellido && (
                  <p className="text-red-500 text-sm">{errors.apellido.message}</p>
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
                  className="absolute inset-y-0 right-4 flex items-center"
                >
                  {showPassword ? <EyeOff /> : <Eye />}
                </button>
                {errors.password && (
                  <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>
              <div>
                <select
                  {...register("fk_id_rol")}
                  className="w-full appearance-none bg-transparent border-0 border-b-1 border-white text-white placeholder-white focus:outline-none focus:ring-0 transition-all"
                >
                  <option className="bg-white text-black" value="">
                    Selecciona un rol
                  </option>
                  {roles.map((rol) => (
                    <option
                      key={rol.id}
                      value={rol.id}
                      className="bg-white text-black"
                    >
                      {rol.nombre}
                    </option>
                  ))}
                </select>
                {errors.fk_id_rol && (
                  <p className="text-red-500 text-sm mt-1">{errors.fk_id_rol.message}</p>
                )}
              </div>
              <p className="text-sm text-gray-500 text-center">
                ¿Ya tienes una cuenta?{" "}
                <a href="/" className="text-green-600">
                  Inicia sesión aquí
                </a>
              </p>
              <button
                type="submit"
                className="w-full py-2 bg-green-600 hover:bg-green-700 transition-colors text-white rounded-full flex items-center justify-center gap-2"
                disabled={loading}
              >
                {loading && <LoadingBox />}
                Registrar
              </button>
            </form>
          </div>

          <div className="hidden md:block w-px bg-white/30 h-4/5 self-center"></div>

          <div className="w-full md:w-1/2 flex flex-col items-center justify-center p-6">
            <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
            <div className="flex space-x-4 mt-4">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 p-3 rounded-full text-white shadow-md"
              >
                <Facebook size={24} />
              </a>
              <a
                href="https://wa.me/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-green-600 p-3 rounded-full text-white shadow-md"
              >
                <MessageCircle size={24} />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
