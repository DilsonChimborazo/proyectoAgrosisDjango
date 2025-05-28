import React, { useState, useEffect } from "react";
import { useActualizarUsuario } from "@/hooks/usuarios/usuario/useUpdateUsuarios";
import { useUsuarioPorId } from "@/hooks/usuarios/usuario/useIdUsuarios";
import Formulario from "@/components/globales/Formulario";
import { Usuario } from "@/hooks/usuarios/usuario/useCreateUsuarios";
import { useRoles } from "@/hooks/usuarios/rol/useRol";
import { UseFicha } from "@/hooks/usuarios/ficha/useFicha";
import VentanaModal from "@/components/globales/VentanasModales";
import { showToast } from "@/components/globales/Toast";

interface ActualizarUsuarioModalProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
}

const ActualizarUsuarioModal: React.FC<ActualizarUsuarioModalProps> = ({ id, isOpen, onClose }) => {
  const { data: usuario, isLoading, error } = useUsuarioPorId(id);
  const actualizarUsuario = useActualizarUsuario();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  const [formData, setFormData] = useState<Partial<Usuario>>({
    identificacion: 0,
    email: "",
    nombre: "",
    apellido: "",
    fk_id_rol: 0,
    ficha: 0,
  });

  useEffect(() => {
    if (usuario && Object.keys(usuario).length > 0) {
      setFormData({
        identificacion: usuario.identificacion ?? 0,
        email: usuario.email ?? "",
        nombre: usuario.nombre ?? "",
        apellido: usuario.apellido ?? "",
        fk_id_rol: usuario.fk_id_rol?.id ?? 0,
        ficha: usuario.ficha?.id ?? 0,
      });
    }
  }, [usuario]);

  const handleSubmit = (data: { [key: string]: string }) => {
    const usuarioActualizado: Partial<Usuario> = {};

    Object.entries(data).forEach(([key, value]) => {
      if (
        typeof value === "string" &&
        value.trim() !== "" &&
        value !== String(usuario?.[key as keyof Usuario])
      ) {
        (usuarioActualizado as any)[key] = ["fk_id_rol", "identificacion", "ficha"].includes(key)
          ? parseInt(value, 10) || 0
          : value;
      }
    });

    const usuarioFinal = Object.fromEntries(
      Object.entries(usuarioActualizado).filter(([_, value]) => value !== undefined)
    );

    actualizarUsuario.mutate(
      { id: Number(id), ...usuarioFinal },
      {
        onSuccess: () => {
         showToast({
          title: 'Usuario actualizado',
          description: "Usuario actualizado correctamente",
          variant: 'success',
        });
          onClose(); // cerrar modal al actualizar
        },
        onError: (error) => {
          console.error("Error al actualizar usuario:", error);
        },
      }
    );
  };

  if (isLoading) return null; // o algún spinner dentro del modal
  if (error) return null; // también puedes manejar error dentro del modal

  return (
    <VentanaModal
      isOpen={isOpen}
      onClose={onClose}
      titulo="Actualizar Usuario"
      size="md"
      variant="content"
      contenido={
        <Formulario
          fields={[
            { id: "identificacion", label: "Identificación", type: "text" },
            { id: "email", label: "Email", type: "email" },
            { id: "nombre", label: "Nombre", type: "text" },
            { id: "apellido", label: "Apellido", type: "text" },
            {
              id: "fk_id_rol",
              label: "Rol",
              type: "select",
              options: roles.map((rol) => ({ value: String(rol.id), label: rol.rol })),
            },
            {
              id: "ficha",
              label: "Ficha",
              type: "select",
              options: fichas
                .filter((f) => f.numero_ficha !== undefined && f.numero_ficha !== undefined)
                .map((f) => ({ value: String(f.numero_ficha), label: f.numero_ficha })),
            },
          ]}
          onSubmit={handleSubmit}
          isError={actualizarUsuario.isError}
          isSuccess={actualizarUsuario.isSuccess}
          initialValues={Object.fromEntries(
            Object.entries(formData).map(([key, value]) => [key, String(value ?? "")])
          )}
          key={JSON.stringify(formData)}
        />
      }
    />
  );
};

export default ActualizarUsuarioModal;
