import { useState } from "react";
import axios from "axios";
import { Eye, EyeOff, Facebook, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCustomForm } from "../../hooks/validaciones/useCustomForm"; // Ajusta la ruta
import { registroSchema, RegistroData } from "../../hooks/validaciones/useSchemas"; // Ajusta la ruta
import logoAgrosis from "../../../public/logo_proyecto-removebg-preview.png";
import logoSena from "../../../public/logoSena.png";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
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
    setLoading(true);
    setError(null);
    setSuccess(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError("La URL de la API no está definida. Por favor, contacta al administrador.");
      setLoading(false);
      return;
    }

    try {
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
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        if (typeof errorData === "object" && !errorData.detail) {
          const errorMessages = Object.values(errorData).flat().join(", ");
          setError(errorMessages || "Error al registrar el usuario");
        } else {
          setError(errorData.detail || "Error al registrar el usuario");
        }
      } else {
        setError("Error inesperado. Por favor, intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  const roles = [
    { id: 1, nombre: "Administrador" },
  ];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white relative">
      <div className="flex w-3/5 h-5/5 bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="w-1/2 flex flex-col justify-center p-8 bg-white">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <img src={logoSena} alt="SENA" className="w-12" />
            <h2 className="text-2xl font-bold text-gray-700">AGROSIS</h2>
          </div>
          <p className="text-center text-gray-500 mb-6">¡Registra tu Superadmin!</p>
          {success && (
            <p className="text-green-600 text-center mb-4">
              ¡Superadmin registrado con éxito! Redirigiendo al login...
            </p>
          )}
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Identificación"
                {...register("identificacion")}
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
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
                className="w-full px-4 py-2 border rounded-md"
              >
                <option value="">Selecciona un rol</option>
                {roles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
              {errors.fk_id_rol && (
                <p className="text-red-500 text-sm">{errors.fk_id_rol.message}</p>
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
              className="w-full py-2 bg-green-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Registrar"}
            </button>
          </form>
        </div>
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-6">
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
  );
}