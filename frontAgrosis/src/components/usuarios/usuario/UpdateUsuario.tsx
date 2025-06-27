import { useState, useEffect } from "react";
import { useUsuarioPorId } from "@/hooks/usuarios/usuario/useIdUsuarios";
import { useActualizarUsuario } from "@/hooks/usuarios/usuario/useUpdateUsuarios";
import { useRoles } from "@/hooks/usuarios/rol/useRol";
import { UseFicha } from "@/hooks/usuarios/ficha/useFicha";
import Formulario from "@/components/globales/Formulario";
import { showToast } from "@/components/globales/Toast";
import VentanaModal from "@/components/globales/VentanasModales";

interface ActualizarUsuarioProps {
  id: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ActualizarUsuarioModal = ({ id, isOpen, onClose, onSuccess }: ActualizarUsuarioProps) => {
  const { data: usuario, isLoading, error } = useUsuarioPorId(id);
  const actualizarUsuario = useActualizarUsuario();
  const { data: roles = [] } = useRoles();
  const { data: fichas = [] } = UseFicha();

  const [formData, setFormData] = useState<Record<string, string>>({
    identificacion: "",
    nombre: "",
    apellido: "",
    email: "",
    fk_id_rol: "",
    ficha: "",
  });

  useEffect(() => {
    if (usuario) {
      setFormData({
        identificacion: String(usuario.identificacion ?? ""),
        nombre: usuario.nombre ?? "",
        apellido: usuario.apellido ?? "",
        email: usuario.email ?? "",
        fk_id_rol: String(usuario.fk_id_rol?.id ?? ""),
        ficha: String(usuario.ficha?.id ?? ""),
      });
    }
  }, [usuario]);

  const handleSubmit = (data: Record<string, string | string[] | File>) => {
    const getString = (val: any) => (Array.isArray(val) ? val[0] : String(val || ""));

    const actualizados = {
      identificacion: getString(data.identificacion),
      nombre: getString(data.nombre),
      apellido: getString(data.apellido),
      email: getString(data.email),
      fk_id_rol: getString(data.fk_id_rol),
      ficha: getString(data.ficha),
    };

    for (const [k, v] of Object.entries(actualizados)) {
      if (!v && k !== "ficha") {  // ✅ permitir que ficha esté vacía
        return showToast({
          title: "Error",
          description: `El campo ${k} es obligatorio`,
          variant: "error",
        });
      }
    }

    actualizarUsuario.mutate(
      {
        id: parseInt(id),
        identificacion: parseInt(actualizados.identificacion),
        nombre: actualizados.nombre,
        apellido: actualizados.apellido,
        email: actualizados.email,
        fk_id_rol: actualizados.fk_id_rol,
        ficha: parseInt(actualizados.ficha),
      },
      {
        onSuccess: () => {
          showToast({
            title: "Éxito",
            description: "Usuario actualizado correctamente",
            variant: "success",
          });
          onSuccess(); // Refrescar lista
          onClose();   // Cerrar modal
        },
        onError: () => {
          showToast({
            title: "Error",
            description: "No se pudo actualizar el usuario",
            variant: "error",
          });
        },
      }
    );
  };

  if (!isOpen) return null;
  if (isLoading) return null;
  if (error) {
    showToast({
      title: "Error",
      description: "No se pudo cargar el usuario",
      variant: "error",
    });
    return null;
  }

  return (
    <VentanaModal
      isOpen={isOpen}
      onClose={onClose}
      titulo="Actualizar Usuario"
      size="md"
      variant="content"
      contenido={
        <Formulario
          title=""
          initialValues={formData}
          key={JSON.stringify(formData)}
          onSubmit={handleSubmit}
          isError={actualizarUsuario.isError}
          isSuccess={actualizarUsuario.isSuccess}
          fields={[
            { id: "identificacion", label: "Identificación", type: "text" },
            { id: "nombre", label: "Nombre", type: "text" },
            { id: "apellido", label: "Apellido", type: "text" },
            { id: "email", label: "Email", type: "email" },
            {
              id: "fk_id_rol",
              label: "Rol",
              type: "select",
              options: roles.map((r) => ({ value: String(r.id), label: r.rol })),
            },
            {
              id: "ficha",
              label: "Ficha",
              type: "select",
              options: [
                { value: "", label: "Sin ficha asignada" }, // 👈 opción opcional
                ...fichas.map((f) => ({
                  value: f.numero_ficha,
                  label: `${f.numero_ficha} - ${f.nombre_ficha}`,
                })),
              ],
            }
          ]}
        />
      }
    />
  );
};

export default ActualizarUsuarioModal;
