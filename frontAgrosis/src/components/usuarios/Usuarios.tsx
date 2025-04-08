import { useState, useCallback, useEffect } from "react";
import { useUsuarios } from "../../hooks/usuarios/useUsuarios";
import { useNavigate } from "react-router-dom";
import Tabla from "../globales/Tabla";
import VentanaModal from "../globales/VentanasModales";

const Usuarios = () => {
  const navigate = useNavigate();
  const { data: usuarios, isLoading, error, refetch } = useUsuarios();
  const [selectedUser, setSelectedUser] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (usuario: Record<string, any>) => {
    navigate(`/editarUsuario/${usuario.id}`);
  };

  const handleCreate = () => {
    if (esAdministrador) {
      navigate("/crearUsuarios");
    } else {
      setMensaje("No tienes permisos para crear usuarios.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedUser(null);
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
      refetch(); // refrescar lista
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje("No se pudo actualizar el estado del usuario");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const headers = ["ID", "identificacion", "Nombre", "Apellido", "Email", "Rol", "Estado"];

  return (
    <div className="overflow-x-auto rounded-lg p-4">
      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}

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
            identificacion: usuario.identificacion,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.fk_id_rol?.rol || "Sin rol asignado",
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
          onCreate={handleCreate}
          createButtonTitle="crear"
        />
      )}

      {selectedUser && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Usuario"
          contenido={selectedUser}
        />
      )}
    </div>
  );
};

export default Usuarios;
