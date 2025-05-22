import { useState, useCallback, useEffect } from "react";
import { useUsuarios } from "@/hooks/usuarios/usuario/useUsuarios";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearUsuario from "../usuario/crearUsuario";
import { showToast } from "@/components/globales/Toast";
import LoadingBox from "@/context/AuthContext";

const Usuarios = () => {
  const navigate = useNavigate();
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje] = useState<string | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  useEffect(() => {
  if (error instanceof Error) {
    showToast({
      title: 'Error al cargar los usuarios',
      description: 'Contacta a soporte',
      variant: 'error',
    });
  }
}, [error]);

  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setModalType("details");
    setModalContenido(null); // Detalles se renderizan directamente en VentanaModal
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (usuario: Record<string, any>) => {
    if (!esAdministrador) {
      showToast({
        title: 'No tienes permisos para esta accion!',
        description: 'Accion solo para el administrador',
        variant: 'error'
        });
        return;
    }
    navigate(`/editarUsuario/${usuario.id}`);
  };

  const openCreateModal = () => {
    if (!esAdministrador) {
      showToast({
        title: 'No tienes permisos para esta accion!',
        description: 'Accion solo para el administrador',
        variant: 'error'
        })
        return;
    }

    setSelectedUser(null);
    setModalType("create");
    setModalContenido(
      <CrearUsuario
        isOpen={true}
        onClose={closeModal}
      />
    );
    setIsModalOpen(true);
  };

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  }, []);

  const handleToggleEstado = async (usuario: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const accion = usuario.is_active ? "desactivar" : "activar";

    try {
      const response = await fetch(`http://localhost:8000/api/usuario/${usuario.id}/${accion}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok){
        showToast({
          title: 'Error al cambiar estado!',
          description: '',
          variant: 'error'
        })
      };

      showToast({
      title: `Usuario ${accion === "activar" ? "activado" : "desactivado"} exitosamente`,
      variant: 'success',
      });
      refetch(); // Refrescar lista
    } catch (err) {
      showToast({
      title: 'Error inesperado!',
      description: 'No se pudo actualizar el estado del usuario.',
      variant: 'error',
    });
    }
  };

  const headers = ["ID", "Imagen", "Identificacion", "Nombre", "Apellido", "Email", "Rol", "Ficha", "Estado"];

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}

      {isLoading && (
        <>
          <LoadingBox />
        </>
      )}

      {Array.isArray(usuarios) && usuarios.length > 0 && (
        <Tabla
          title="Lista de Usuarios"
          headers={headers}
          data={usuarios.map((usuario) => ({
            id: usuario.id,
            imagen: (
              <img
                src={usuario.img_url || "http://localhost:8000/media/imagenes/defecto.png"}
                alt="foto"
                className="w-10 h-7 md:w-10 md:h-7 rounded-full object-cover"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (!target.src.includes("defecto.png")) {
                    target.src = "http://localhost:8000/media/imagenes/defecto.png";
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
                <div className={`w-11 h-6 rounded-full transition-colors duration-300 ${usuario.is_active ? 'bg-green-500' : 'bg-gray-300'}`}>
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${usuario.is_active ? 'translate-x-6' : 'translate-x-1'} mt-0.5 ml-0.5`}
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

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={
            modalType === "details"
              ? "Detalles del Usuario"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedUser ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {selectedUser.id}</p>
                <p><strong>Identificación:</strong> {selectedUser.identificacion}</p>
                <p><strong>Nombre:</strong> {selectedUser.nombre || "Sin nombre"}</p>
                <p><strong>Apellido:</strong> {selectedUser.apellido || "Sin apellido"}</p>
                <p><strong>Email:</strong> {selectedUser.email || "Sin email"}</p>
                <p><strong>Rol:</strong> {selectedUser.fk_id_rol?.rol || "Sin rol asignado"}</p>
                <p><strong>Ficha:</strong> {selectedUser.ficha?.numero_ficha || "Sin ficha asignada"}</p>
                <p><strong>Estado:</strong> {selectedUser.is_active ? "Activo" : "Inactivo"}</p>
                <p><strong>Imagen:</strong> 
                  <img
                    src={selectedUser.img_url || "http://localhost:8000/media/imagenes/defecto.png"}
                    alt="foto"
                    className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes("defecto.png")) {
                        target.src = "http://localhost:8000/media/imagenes/defecto.png";
                      }
                    }}
                  />
                </p>
              </div>
            ) : (
              modalContenido
            )
          }
        />
      )}
    </div>
  );
};

export default Usuarios;