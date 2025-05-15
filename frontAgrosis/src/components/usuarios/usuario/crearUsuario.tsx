import React, { useState } from 'react';
import { Usuario } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import { useCreateUsuarios } from '@/hooks/usuarios/usuario/useCreateUsuarios';
import Formulario from '@/components/globales/Formulario';
import { useRoles } from '@/hooks/usuarios/rol/useRol';
import { UseFicha } from '@/hooks/usuarios/ficha/useFicha';
import CrearFicha from '../ficha/crearFicha';
import CargaMasivaUsuarios from './CargaMasiva';
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

  const [modalAbiertoRol, setModalAbiertoRol] = useState(false);
  const [modalAbiertoFicha, setModalAbiertoFicha] = useState(false);
  const [modalAbiertoCargaMasiva, setModalAbiertoCargaMasiva] = useState(false)

  const abrirModalFicha = () => setModalAbiertoFicha(true);
  const cerrarModalFicha = () => setModalAbiertoFicha(false);

  const abrirModalRol = () => setModalAbiertoRol(true);
  const cerrarModalRol = () => setModalAbiertoRol(false);

  const abrirModalCargaMasiva = () => setModalAbiertoCargaMasiva(true);;
  const cerrarModalCargaMasiva = () => setModalAbiertoCargaMasiva(false);

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
    {
      id: 'carga_masiva',
      label: 'Carga masiva',
      type: 'select', 
      hasExtraButton: true,
      extraButtonText: 'carga masiva',
      onExtraButtonClick: abrirModalCargaMasiva,
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    if (
      !formData.identificacion ||
      !formData.email ||
      !formData.nombre ||
      !formData.apellido ||
      !formData.password ||
      !formData.fk_id_rol 
      
    ) {
      console.error('Campos faltantes');
      return;
    }

    const identificacion = parseInt(formData.identificacion, 10);
    const fk_id_rol = parseInt(formData.fk_id_rol, 10);
    const ficha = parseInt(formData.ficha, 10);

    if (isNaN(identificacion) || isNaN(fk_id_rol)) {
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

    if (!isNaN(ficha)) {
      newUsuario.ficha = ficha;
    }

    mutation.mutate(newUsuario, {
      onSuccess: () => {
        onClose(); 
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
      isOpen={modalAbiertoRol}
      onClose={cerrarModalRol}
      titulo=""
      size="sm"
      variant="content"
      contenido={<CrearRol onClose={cerrarModalRol} />}
      />

      <VentanaModal
        isOpen={modalAbiertoFicha}
        onClose={cerrarModalFicha}
        titulo=""
        size="sm"
        variant="content"
        contenido={<CrearFicha onClose={cerrarModalFicha} />}
      />
      <VentanaModal
        isOpen={modalAbiertoCargaMasiva}
        onClose={cerrarModalCargaMasiva}
        titulo="Carga Masiva de Usuarios"
        size="sm"
        variant="content"
        contenido={<CargaMasivaUsuarios onClose={cerrarModalCargaMasiva} />}
      />

    </> 
  );
};

export default CrearUsuario;
