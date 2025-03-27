import { useState } from 'react';
import axios from 'axios';
import { Eye, EyeOff, Facebook, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import logoAgrosis from '../../../public/logo_proyecto-removebg-preview.png';
import logoSena from '../../../public/logoSena.png';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    identificacion: '',
    email: '',
    nombre: '',
    apellido: '',
    password: '',
    fk_id_rol: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // Especificamos el tipo de error
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const apiUrl = import.meta.env.VITE_API_URL;
    if (!apiUrl) {
      setError('La URL de la API no está definida. Por favor, contacta al administrador.');
      setLoading(false);
      return;
    }

    try {
      const dataToSend = {
        ...formData,
        fk_id_rol: parseInt(formData.fk_id_rol),
      };

      const response = await axios.post(`${apiUrl}usuario/`, dataToSend, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      // Usamos la respuesta para confirmar el éxito
      if (response.status === 201) {
        setSuccess(true);
        setFormData({
          identificacion: '',
          email: '',
          nombre: '',
          apellido: '',
          password: '',
          fk_id_rol: '',
        });
        setTimeout(() => navigate('/login'), 2000); // Redirige al login después de 2 segundos
      }
    } catch (err) {
      // Mejoramos el manejo de errores
      if (axios.isAxiosError(err) && err.response) {
        const errorData = err.response.data;
        // Si el backend devuelve un objeto con errores, lo convertimos en un mensaje legible
        if (typeof errorData === 'object' && !errorData.detail) {
          const errorMessages = Object.values(errorData).flat().join(', ');
          setError(errorMessages || 'Error al registrar el usuario');
        } else {
          setError(errorData.detail || 'Error al registrar el usuario');
        }
      } else {
        setError('Error inesperado. Por favor, intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  // Lista de roles (ajusta los IDs según los que tengas en la base de datos)
  const roles = [
    { id: 1, nombre: 'Administrador' },
  ];

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-white relative">
      <div className="flex w-3/5 h-5/5 bg-white shadow-lg rounded-lg overflow-hidden">
        {/* Sección izquierda con formulario */}
        <div className="w-1/2 flex flex-col justify-center p-8 bg-white">
          {/* Logo del SENA junto a AgroSIS */}
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
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              placeholder="Identificación"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Correo"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <input
              type="text"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder="Apellido"
              required
              className="w-full px-4 py-2 border rounded-md"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Contraseña"
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
            <select
              name="fk_id_rol"
              value={formData.fk_id_rol}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border rounded-md"
            >
              <option value="">Selecciona un rol</option>
              {roles.map((rol) => (
                <option key={rol.id} value={rol.id}>
                  {rol.nombre}
                </option>
              ))}
            </select>
            <p className="text-sm text-gray-500 text-center">
              ¿Ya tienes una cuenta?{' '}
              <a href="/" className="text-green-600">
                Inicia sesión aquí
              </a>
            </p>
            <button
              type="submit"
              className="w-full py-2 bg-green-600 text-white rounded-md"
              disabled={loading}
            >
              {loading ? 'Registrando...' : 'Registrar'}
            </button>
          </form>
        </div>

        {/* Sección derecha con logo y botones de redes sociales */}
        <div className="w-1/2 flex flex-col items-center justify-center bg-gray-100 p-6">
          <img src={logoAgrosis} alt="AgroSIS" className="w-48 mb-4" />
          {/* Redes sociales debajo del logo */}
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