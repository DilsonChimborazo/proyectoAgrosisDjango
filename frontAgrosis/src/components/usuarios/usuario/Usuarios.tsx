import { useState, useCallback, useEffect } from "react";
import { useUsuarios } from "@/hooks/usuarios/usuario/useUsuarios";
import Tabla from "@/components/globales/Tabla";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearUsuario from "../usuario/crearUsuario";
import ActualizarUsuarioModal from "../usuario/UpdateUsuario";
import { showToast } from "@/components/globales/Toast";
import LoadingBox from "@/components/globales/LoadingBox";


const Usuarios = () => {
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      setEsAdministrador(payload.rol === "Administrador");
    }
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
    if (error instanceof Error) {
      showToast({
        title: "Error al cargar los usuarios",
        description: "Contacta a soporte",
        variant: "error",
      });
    }
  }, [error]);

  const openModalHandler = useCallback(async (usuario: Record<string, any>) => {
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/api/usuario/${usuario.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSelectedUser(data);
      setModalType("details");
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    }
  }, []);

  const handleUpdate = (usuario: Record<string, any>) => {
    if (!esAdministrador) {
      showToast({
        title: "No tienes permisos para esta acción!",
        description: "Acción solo para el administrador",
        variant: "error",
      });
      return;
    }

    setSelectedUser(usuario);
    setModalType("update");
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    if (!esAdministrador) {
      showToast({
        title: "No tienes permisos para esta acción!",
        description: "Acción solo para el administrador",
        variant: "error",
      });
      return;
    }

    setSelectedUser(null);
    setModalType("create");
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setModalType(null);
    setIsModalOpen(false);
    refetch();
  }, [refetch]);

  const handleToggleEstado = async (usuario: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const accion = usuario.is_active ? "desactivar" : "activar";

    try {
      const response = await fetch(
        `/api/usuario/${usuario.id}/${accion}/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        showToast({
          title: "Error al cambiar estado!",
          variant: "error",
        });
      }

      showToast({
        title: `Usuario ${accion === "activar" ? "activado" : "desactivado"} exitosamente`,
        variant: "success",
      });

      refetch();
    } catch (err) {
      showToast({
        title: "Error inesperado!",
        description: "No se pudo actualizar el estado del usuario.",
        variant: "error",
      });
    }
  };

  const headers = [
    "ID",
    "Imagen",
    "Identificacion",
    "Nombre",
    "Apellido",
    "Email",
    "Rol",
    "Ficha",
    "Estado",
  ];

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">{mensaje}</div>
      )}

      {isLoading && <LoadingBox />}

      {Array.isArray(usuarios) && usuarios.length > 0 && (
        <Tabla
          title="Lista de Usuarios"
          headers={headers}
          data={usuarios.map((usuario) => ({
            id: usuario.id,
            imagen: (
              <img
                src={usuario.img_url || "http://localhost:8000/media/imagenes/defecto.jpg"}
                alt="foto"
                className="w-10 h-7 md:w-10 md:h-7 rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("defecto.png")) {
                    target.src = "http://localhost:8000/media/imagenes/defecto.jpg";
                  }
                }}
              />
            ),
            identificacion: usuario.identificacion,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.fk_id_rol?.rol || "Sin rol asignado",
            ficha: usuario.ficha?.numero_ficha || "Sin ficha asignada",
            estado: esAdministrador ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={usuario.is_active}
                  onChange={() => handleToggleEstado(usuario)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                    usuario.is_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                      usuario.is_active ? "translate-x-6" : "translate-x-1"
                    } mt-0.5 ml-0.5`}
                  ></div>
                </div>
              </label>
            ) : (
              <span className="text-sm text-gray-500">
                {usuario.is_active ? "Activo" : "Inactivo"}
              </span>
            ),
          }))}
          onClickAction={openModalHandler}
          onUpdate={handleUpdate}
          onCreate={openCreateModal}
          createButtonTitle="Crear"
        />
      )}

      {/* Detalles del usuario */}
      {isModalOpen && modalType === "details" && selectedUser && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Usuario"
          contenido={
            <div className="grid grid-cols-2 gap-4">
              <p><strong>Identificación:</strong> {selectedUser.identificacion}</p>
              <p><strong>Nombre:</strong> {selectedUser.nombre || "Sin nombre"}</p>
              <p><strong>Apellido:</strong> {selectedUser.apellido || "Sin apellido"}</p>
              <p><strong>Email:</strong> {selectedUser.email || "Sin email"}</p>
              <p><strong>Rol:</strong> {selectedUser.fk_id_rol?.rol || "Sin rol asignado"}</p>
              <p><strong>Ficha:</strong> {selectedUser.ficha?.numero_ficha || "Sin ficha asignada"}</p>
              <p><strong>Estado:</strong> {selectedUser.is_active ? "Activo" : "Inactivo"}</p>
              <p><strong>Imagen:</strong>
                <img
                  src={selectedUser.img_url || "http://localhost:8000/media/imagenes/defecto.jpg"}
                  alt="foto"
                  className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (!target.src.includes("defecto.png")) {
                      target.src = "http://localhost:8000/media/imagenes/defecto.jpg";
                    }
                  }}
                />
              </p>
            </div>
          }
        />
      )}

      {/* Crear usuario */}
      {isModalOpen && modalType === "create" && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Crear Usuario"
          contenido={<CrearUsuario isOpen={true} onClose={closeModal} onSuccess={() => {
          closeModal(); 
          showToast({
            title: "Usuario creado correctamente",
            variant: "success",
          });
        }} />}
        />
      )}

      {/* Actualizar usuario */}
      {isModalOpen && modalType === "update" && selectedUser && (
        <ActualizarUsuarioModal id={String(selectedUser.id)} isOpen={isModalOpen} onClose={closeModal} onSuccess={refetch}/>
      )}
    </div>
  );
};

export default Usuarios;
