import React, { useState, useEffect, useMemo, useRef } from 'react';
import { usePerfilUsuario } from '../../../hooks/usuarios/usuario/usePerfilUsuarios';
import { FormData } from '../../../hooks/usuarios/usuario/usePerfilUsuarios';

const PerfilUsuario: React.FC = () => {
  const { perfil, isLoading, error, updatePerfil, isUpdating } = usePerfilUsuario();

  const [formData, setFormData] = useState<FormData>({
    nombre: '',
    apellido: '',
    email: '',
    img: null,
  });

  const [preview, setPreview] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (perfil) {
      setFormData({
        nombre: perfil.nombre,
        apellido: perfil.apellido,
        email: perfil.email,
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

    if (!formData.nombre || !formData.apellido || !formData.email) {
      setFormError('Por favor, completa todos los campos');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setFormError('Por favor, ingresa un correo válido');
      return;
    }

    updatePerfil(formData);
  };

  const imageUrl = useMemo(() => {
    if (preview) return preview;
    return perfil?.img_url || 'http://localhost:8000/media/imagenes/defecto.png';
  }, [preview, perfil?.img_url]);

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;
  if (!perfil) return null;

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Perfil de Usuario</h2>
      <div className="flex justify-center mb-6 relative">
        <div className="relative w-32 h-32 group">
          <img
            src={imageUrl}
            alt="Foto de perfil"
            className="w-32 h-32 rounded-full object-cover "
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
            <span className="text-white text-sm font-medium">Cambiar foto</span>
          </div>
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
      <div className="mb-4 text-center">
        <p className="text-gray-600">Rol: {perfil.fk_id_rol?.rol || 'Sin rol'}</p>
        <p className="text-gray-600">Ficha: {perfil.ficha?.numero_ficha || 'Sin ficha'}</p>
      </div>

      {formError && (
        <div className="text-red-500 text-center mb-4">
          <p>{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
            Nombre
          </label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleChange}
            placeholder="Nombre"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="apellido" className="block text-sm font-medium text-gray-700">
            Apellido
          </label>
          <input
            type="text"
            id="apellido"
            name="apellido"
            value={formData.apellido}
            onChange={handleChange}
            placeholder="Apellido"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          disabled={isUpdating}
          className="w-full bg-green-500 text-white p-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 transition-colors"
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
  );
};

export default PerfilUsuario;