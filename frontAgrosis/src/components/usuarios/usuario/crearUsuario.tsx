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
import { showToast } from "@/components/globales/Toast";


interface CrearUsuarioProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

interface FormField {
  id: string;
  label: string;
  type: string;
  options?: { value: string; label: string }[];
  hasExtraButton?: boolean;
  extraButtonText?: string;
  onExtraButtonClick?: () => void;
  onChange?: (e: React.ChangeEvent<any>) => void;
  disabled?: boolean;
  extraContent?: React.ReactNode;
}

const CrearUsuario: React.FC<CrearUsuarioProps> = ({ isOpen, onClose }) => {
  const mutation = useCreateUsuarios();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  const [modalAbiertoRol, setModalAbiertoRol] = useState(false);
  const [modalAbiertoFicha, setModalAbiertoFicha] = useState(false);
  const [modalAbiertoCargaMasiva, setModalAbiertoCargaMasiva] = useState(false);

  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");

  const abrirModalFicha = () => setModalAbiertoFicha(true);
  const cerrarModalFicha = () => setModalAbiertoFicha(false);

  const abrirModalRol = () => setModalAbiertoRol(true);
  const cerrarModalRol = () => setModalAbiertoRol(false);

  const abrirModalCargaMasiva = () => {
    const existeInvitado = roles?.some((rol) => rol.rol === "Invitado");
    if (!existeInvitado) {
      showToast({
          title: 'Debe aver un rol de invitado',
          description: 'Primero debes crear un rol llamado Invitado antes de cargar usuarios masivamente',
          variant: 'error',
        });
      return;
    }
    setModalAbiertoCargaMasiva(true);
  };
  const cerrarModalCargaMasiva = () => setModalAbiertoCargaMasiva(false);

  const formFields: FormField[] = [
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
      onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedId = e.target.value;
        const rol = roles.find((r) => String(r.id) === selectedId);
        if (rol) setRolSeleccionado(rol.rol);
  },
    },
    {
    id: "ficha",
    label: "Ficha",
    type: "select",
    options: Array.isArray(fichas)
      ? fichas.map((f) => ({
          value: String(f.numero_ficha),
          label: `${f.numero_ficha} - ${f.nombre_ficha ?? ""}`,
        }))
      : [],
    hasExtraButton: true,
    extraButtonText: "+",
    onExtraButtonClick: abrirModalFicha,
    disabled: ["Administrador", "Instructor", "Invitado"].includes(rolSeleccionado),
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
  }
  ];

  const handleSubmit = (formData: { [key: string]: any }) => {
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
