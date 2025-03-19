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
  
    if (usuarioGuardado) {
      const usuario = JSON.parse(usuarioGuardado);
  
      if (usuario?.fk_id_rol?.rol === "Administrador") {
        setEsAdministrador(true);
      } else {
        setEsAdministrador(false);
      }
    } else {
      setEsAdministrador(false);
    }
  }, []);
  

  const handleCrearUsuario = () => {
    if (esAdministrador) {
      navigate("/crearUsuarios");
    } else {
      setMensaje("No tienes permisos para crear usuarios.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const openModalHandler = useCallback((usuario: Record<string, any>) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);

  const headers = ["Identificación", "Nombre", "Apellido", "Email", "Rol"];

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Usuarios</h2>

      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}

      <button
        onClick={handleCrearUsuario}
        className={`px-4 py-2 rounded-lg mb-4 ${
          esAdministrador ? "bg-green-600 text-white" : "bg-gray-400 text-gray-700 cursor-not-allowed"
        }`}
      >
        + Crear Usuario
      </button>

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
            identificacion: usuario.identificacion,
            nombre: usuario.nombre,
            apellido: usuario.apellido,
            email: usuario.email,
            rol: usuario.fk_id_rol?.rol || "Sin rol asignado",
          }))}
          onClickAction={openModalHandler}
        />
      )}

      {selectedUser && (
        <VentanaModal isOpen={isModalOpen} onClose={closeModal} titulo="Detalles del Usuario" contenido={selectedUser} />
      )}
    </div>
  );
};

export default Usuarios;