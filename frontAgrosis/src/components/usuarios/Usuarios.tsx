import { useState, useCallback, useEffect } from "react";
import { useUsuarios } from "../../hooks/usuarios/useUsuarios";
import { useNavigate } from "react-router-dom";
import Tabla from "../globales/Tabla";
import VentanaModal from "../globales/VentanasModales";

const Usuarios = () => {
  const navigate = useNavigate();
  const { data: usuarios, isLoading, error } = useUsuarios();
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
    }else {
      setMensaje("No tienes permisos para crear usuarios.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);

  const headers = ["ID", "identificacion", "Nombre", "Apellido", "Email", "Rol"];

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
