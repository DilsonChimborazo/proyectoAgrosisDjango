import { useState, useCallback, useEffect } from "react";
import { useUsuarios } from "@/hooks/usuarios/usuario/useUsuarios";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearUsuario from "../usuario/crearUsuario";

const Usuarios = () => {
  const navigate = useNavigate();
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setModalType("details");
    setModalContenido(null); // Detalles se renderizan directamente en VentanaModal
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (usuario: Record<string, any>) => {
    if (!esAdministrador) {
      setMensaje("No tienes permiso para actualizar usuarios");
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    navigate(`/editarUsuario/${usuario.id}`);
  };

  const openCreateModal = () => {
    if (!esAdministrador) {
      setMensaje("No tienes permisos para crear usuarios.");
      setTimeout(() => setMensaje(null), 3000);
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

      if (!response.ok) throw new Error("Error al cambiar estado");

      setMensaje(`Usuario ${accion === "activar" ? "activado" : "desactivado"} exitosamente`);
      refetch(); // Refrescar lista
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje("No se pudo actualizar el estado del usuario");
      setTimeout(() => setMensaje(null), 3000);
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

      <div className='mb-4 text-right'>
        <button
          onClick={() => navigate('/fichas')}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 d-flex justify-center"
        >
          Ver Lista de Fichas
        </button>
      </div>

      {isLoading && <div className="text-center text-gray-500">Cargando usuarios...</div>}

      {error instanceof Error && (
        <div className="text-center text-red-500">
          Error al cargar los usuarios: {error.message}
        </div>
      )}

      {!isLoading && !error && (!Array.isArray(usuarios) || usuarios.length === 0) && (
        <div className="text-center text-gray-500">No hay usuarios registrados.</div>
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