import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePerfilUsuario } from '../../../hooks/usuarios/usuario/usePerfilUsuarios';
import { FormData } from '../../../hooks/usuarios/usuario/usePerfilUsuarios';
import { perfilSchema } from '@/hooks/validaciones/useSchemas';
import { Eye, EyeOff } from "lucide-react";



const PerfilUsuario: React.FC = () => {
  const { perfil, isLoading, error, updatePerfil, isUpdating } = usePerfilUsuario();


  const [formData, setFormData] = useState<FormData>({
    identificacion: '',
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    img: null,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (perfil) {
      setFormData({
        identificacion: perfil.identificacion,
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
        password:'',
        img: null,
      });
    }
  }, [perfil]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormError(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData((prev) => ({ ...prev, img: file }));
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);
    } else {
      setPreview(null);
    }
  };


  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    

    const result = perfilSchema.safeParse(formData);

  if (!result.success) {
    // Extraer el primer error
    const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
    setFormError(firstError || 'Datos inválidos');
    return;
  }

  const dataToUpdate = { ...formData };
  if (!formData.password) {
    delete dataToUpdate.password;
  }

  updatePerfil(dataToUpdate);
};

  const imageUrl = useMemo(() => {
    if (preview) return preview;
    return perfil?.img_url || 'http://localhost:8000/media/imagenes/defecto.png';
  }, [preview, perfil?.img_url]);

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;
  if (!perfil) return null;

  

  return (
    <div className="max-w-4xl mx-auto my-10 flex bg-white shadow-lg rounded-xl overflow-hidden">
      {/* Lado izquierdo amarillo con imagen, rol y ficha */}
      <div className="w-1/3 bg-green-700 flex flex-col items-center justify-center p-6 text-white">
        {/* Imagen de perfil */}
        <div className="relative w-24 h-24 group mb-4">
          <img
            src={imageUrl}
            alt="Foto de perfil"
            className="w-24 h-24 rounded-full object-cover shadow-lg"
            onError={(e) => {
              const target = e.currentTarget;
              if (!target.src.includes('defecto.png')) {
                target.src = 'http://localhost:8000/media/imagenes/defecto.png';
              }
            }}
          />
          <div
            className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={handleImageClick}
          >
            <span className="text-white text-sm font-medium">Cambiar</span>
          </div>
          <input
            type="file"
            id="img"
            name="img"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
            ref={fileInputRef}
          />
        </div>
  
        {/* Rol y ficha */}
        <div className="text-center">
          <p className="font-semibold">{perfil.fk_id_rol?.rol || 'Sin rol'}</p>
          <p className="text-sm">{perfil.ficha?.numero_ficha || 'Sin ficha'}</p>
        </div>
  
      
      </div>
  
      {/* Lado derecho: formulario */}
      <div className="w-2/3 p-8">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Perfil de Usuario</h2>
  
        {formError && (
          <div className="text-red-500 text-center mb-4">
            <p>{formError}</p>
          </div>
        )}
  
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative w-full">
            <input
              type="text"
              id="identificacion"
              name="identificacion"
              value={formData.identificacion}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="identificacion"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
            Identificación
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="nombre"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
            Nombre
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="apellido"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
            Apellido
            </label>
          </div>
          <div className="relative w-full">
            <input
              type="text"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="email"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
            Email
            </label>
          </div>
          <div className="relative w-full">
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder=" "
              className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent border border-gray-300 rounded-lg appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
            />
            <label
              htmlFor="password"
              className="absolute text-sm text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
            >
              New password
            </label>
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute inset-y-0 end-2 flex items-center pr-3 text-gray-500 hover:text-gray-700 focus:outline-none"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
        </div>
          <button
            type="submit"
            disabled={isUpdating}
            className="w-full bg-green-700 text-white p-3 rounded-lg hover:bg-green-800 disabled:bg-gray-400 transition-colors"
          >
            {isUpdating ? (
              <span className="flex justify-center items-center">
                <div className="w-4 h-4 border-t-2 border-white border-solid rounded-full animate-spin mr-2"></div>
                Actualizando...
              </span>
            ) : (
              'Actualizar Perfil'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PerfilUsuario;