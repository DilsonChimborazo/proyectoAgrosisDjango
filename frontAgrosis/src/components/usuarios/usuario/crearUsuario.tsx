import React from 'react';
import { Usuario } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import { useCreateUsuarios } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import Formulario from '@/components/globales/Formulario';
import { useRoles } from '@/hooks/usuarios/rol/useRol';
import { UseFicha } from '@/hooks/usuarios/ficha/useFicha';

interface CrearUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ isOpen, onClose }) => {
  const mutation = useCreateUsuarios();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  if (!isOpen) return null; // Si la modal no debe estar abierta, no renderiza nada

  const formFields = [
    { id: 'identificacion', label: 'Identificación', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'apellido', label: 'Apellido', type: 'text' },
    { id: 'password', label: 'Contraseña', type: 'password' },
    {
      id: "fk_id_rol",
      label: "Rol",
      type: "select",
      options: Array.isArray(roles) ? roles.map((rol) => ({
        value: String(rol.id),
        label: rol.rol
      })) : []
    },
    {
      id: "ficha",
      label: "Ficha",
      type: "select",
      options: Array.isArray(fichas) ? fichas.map((numero_ficha) => ({
        value: String(numero_ficha.id),
        label: numero_ficha.numero_ficha
      })) : []
    }
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (!formData.identificacion || !formData.email || !formData.nombre || !formData.apellido || !formData.password || !formData.fk_id_rol || !formData.ficha) {
      console.error('Campos faltantes');
      return;
    }

    const identificacion = parseInt(formData.identificacion, 10);
    const fk_id_rol = parseInt(formData.fk_id_rol, 10);
    const ficha = parseInt(formData.ficha, 10);

    if (isNaN(identificacion) || isNaN(fk_id_rol) || isNaN(ficha)) {
      console.error('Identificación, rol o ficha inválido');
      return;
    }

    const newUsuario: Usuario = {
      identificacion,
      email: formData.email,
      nombre: formData.nombre,
      apellido: formData.apellido,
      password: formData.password,
      fk_id_rol,
      ficha,
    };

    mutation.mutate(newUsuario, {
      onSuccess: () => {
        onClose(); // Cierra la modal después de éxito
      }
    });
  };

  return (
   
        <Formulario
          fields={formFields}
          onSubmit={handleSubmit}
          isError={mutation.isError}
          isSuccess={mutation.isSuccess}
          title="Crear Nuevo Usuario"
        />
  );
};


export default CrearUsuario;
