import React, { useState } from 'react';
import { Usuario } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import { useCreateUsuarios } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import Formulario from '@/components/globales/Formulario';
import { useRoles } from '@/hooks/usuarios/rol/useRol';
import { UseFicha } from '@/hooks/usuarios/ficha/useFicha';
import CrearFicha from '../ficha/crearFicha';
import VentanaModal from '@/components/globales/VentanasModales';
import CrearRol from '../rol/crearRol';

interface CrearUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ isOpen, onClose }) => {
  const mutation = useCreateUsuarios();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirModalFicha = () => setModalAbierto(true);
  const cerrarModalFicha = () => setModalAbierto(false);

  const abrirModalRol = () => setModalAbierto(true);
  const cerrarModalRol = () => setModalAbierto(false);

  const formFields = [
    { id: 'identificacion', label: 'Identificación', type: 'text' },
    { id: 'email', label: 'Email', type: 'text' },
    { id: 'nombre', label: 'Nombre', type: 'text' },
    { id: 'apellido', label: 'Apellido', type: 'text' },
    { id: 'password', label: 'Contraseña', type: 'password' },
    {
      id: 'fk_id_rol',
      label: 'Rol',
      type: 'select',
      options: Array.isArray(roles)
        ? roles.map((rol) => ({ value: String(rol.id), label: rol.rol }))
        : [],
      
      hasExtraButton: true,
      extraButtonText: '+',
      onExtraButtonClick: abrirModalRol,
    },
    {
      id: 'ficha',
      label: 'Ficha',
      type: 'select',
      options: Array.isArray(fichas)
        ? fichas.map((f) => ({ value: String(f.id), label: f.numero_ficha }))
        : [],
      hasExtraButton: true,
      extraButtonText: '+',
      onExtraButtonClick: abrirModalFicha,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.identificacion ||
      !formData.email ||
      !formData.nombre ||
      !formData.apellido ||
      !formData.password ||
      !formData.fk_id_rol ||
      !formData.ficha
    ) {
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
    };

    mutation.mutate(newUsuario, {
      onSuccess: () => {
        onClose(); // Cierra la modal principal
      },
    });
  };

  return (
    <>
      <VentanaModal
        isOpen={isOpen}
        onClose={onClose}
        titulo="Crear Nuevo Usuario"
        size="md"
        variant="content"
        contenido={
          <Formulario
            fields={formFields}
            onSubmit={handleSubmit}
            isError={mutation.isError}
            isSuccess={mutation.isSuccess}
            title=""
          />
        }
      />
      <VentanaModal
      isOpen={modalAbierto}
      onClose={cerrarModalRol}
      titulo=""
      size="sm"
      variant="content"
      contenido={<CrearRol onClose={cerrarModalRol} />}
      />

      <VentanaModal
        isOpen={modalAbierto}
        onClose={cerrarModalFicha}
        titulo=""
        size="sm"
        variant="content"
        contenido={<CrearFicha onClose={cerrarModalFicha} />}
      />
    </> 
  );
};

export default CrearUsuario;
