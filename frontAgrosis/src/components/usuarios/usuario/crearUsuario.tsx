import React, { useState } from "react";
import { Usuario } from "@/hooks/usuarios/usuario/useCreateUsuarios";
import { useCreateUsuarios } from "@/hooks/usuarios/usuario/useCreateUsuarios";
import Formulario from "@/components/globales/Formulario";
import { useRoles } from "@/hooks/usuarios/rol/useRol";
import { UseFicha } from "@/hooks/usuarios/ficha/useFicha";
import CrearFicha from "../ficha/crearFicha";
import CargaMasivaUsuarios from "./CargaMasiva";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearRol from "../rol/crearRol";
import { Upload } from "lucide-react";
import { usuarioSchema } from "@/hooks/validaciones/useSchemas";


interface CrearUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ isOpen, onClose }) => {
  const mutation = useCreateUsuarios();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  const [modalAbiertoRol, setModalAbiertoRol] = useState(false);
  const [modalAbiertoFicha, setModalAbiertoFicha] = useState(false);
  const [modalAbiertoCargaMasiva, setModalAbiertoCargaMasiva] = useState(false);

  const abrirModalFicha = () => setModalAbiertoFicha(true);
  const cerrarModalFicha = () => setModalAbiertoFicha(false);

  const abrirModalRol = () => setModalAbiertoRol(true);
  const cerrarModalRol = () => setModalAbiertoRol(false);

  const abrirModalCargaMasiva = () => setModalAbiertoCargaMasiva(true);
  const cerrarModalCargaMasiva = () => setModalAbiertoCargaMasiva(false);

  const formFields = [
    { id: "identificacion", label: "Identificación", type: "text" },
    { id: "email", label: "Email", type: "text" },
    { id: "nombre", label: "Nombre", type: "text" },
    { id: "apellido", label: "Apellido", type: "text" },
    { id: "password", label: "Contraseña", type: "password" },
    {
      id: "fk_id_rol",
      label: "Rol",
      type: "select",
      options: Array.isArray(roles)
        ? roles.map((rol) => ({ value: String(rol.id), label: rol.rol }))
        : [],
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalRol,
    },
    {
      id: "ficha",
      label: "Ficha",
      type: "select",
      options: Array.isArray(fichas)
        ? fichas.map((f) => ({ value: String(f.numero_ficha), label: `${f.numero_ficha} - ${f.nombre_ficha ?? ""}`, }))
        : [],
      hasExtraButton: true,
      extraButtonText: "+",
      onExtraButtonClick: abrirModalFicha,
      extraContent: (
        <div className="mt-4 flex justify-start">
          <button
            type="button"
            onClick={abrirModalCargaMasiva}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-sm transition duration-300 ease-in-out"
          >
            <Upload size={18} />
            Carga Masiva
          </button>
        </div>
      ),
    },
  ];

  const handleSubmit = (formData: { [key: string]: string }) => {
    // Aquí confiamos que formData ya está validado por Zod en Formulario
    const identificacion = parseInt(formData.identificacion, 10);
    const fk_id_rol = parseInt(formData.fk_id_rol, 10);
    const ficha = parseInt(formData.ficha, 10);

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
            schema={usuarioSchema} // PASA EL ESQUEMA ZOD AQUÍ
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
