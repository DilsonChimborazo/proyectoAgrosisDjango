import { useState, useCallback, useEffect } from "react";
import { useUsuarios, Usuario } from "../../hooks/usuarios/useUsuarios"; 
import { useNavigate } from "react-router-dom";
import Tabla from "../globales/Tabla";
import VentanaModal from "../globales/VentanasModales";

const Usuarios = () => {
  const navigate = useNavigate();
  const { data: usuarios = [], isLoading, error } = useUsuarios(); 
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [esAdministrador, setEsAdministrador] = useState(false); 
  const [mensaje, setMensaje] = useState<string | null>(null); 


  useEffect(() => {
    const usuarioGuardado = JSON.parse(localStorage.getItem("userData") || "[]");
    if (Array.isArray(usuarioGuardado) && usuarioGuardado.length > 0) {
      const usuario = usuarioGuardado[0] as Usuario;
      setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
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


  const openModalHandler = useCallback((usuario: Usuario) => {
    setSelectedUser(usuario);
    setIsModalOpen(true);
  }, []);


  const closeModal = useCallback(() => {
    setSelectedUser(null);
    setIsModalOpen(false);
  }, []);


  const handleUpdate = (usuario: Usuario) => {
    navigate(`/actualizarcultivo/${usuario.id}`);
  };


  const headers = ["ID", "Identificación", "Nombre", "Apellido", "Email", "Rol"];


  const mappedUsuarios = usuarios.map((usuario) => ({
    id: usuario.id,
    identificacion: usuario.identificacion,
    nombre: usuario.nombre,
    apellido: usuario.apellido,
    email: usuario.email,
    rol: usuario.fk_id_rol?.rol || "Sin rol asignado",
  }));

  return (
    <div className="overflow-x-auto  rounded-lg p-4">
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
        disabled={!esAdministrador}
      >
        + Crear Usuario
      </button>
      {isLoading && <div className="text-center text-gray-500">Cargando usuarios...</div>}
      {error && (
        <div className="text-center text-red-500">
          Error al cargar los usuarios: {error.message}
        </div>
      )}
      {!isLoading && !error && mappedUsuarios.length === 0 && (
        <div className="text-center text-gray-500">No hay usuarios registrados.</div>
      )}

        <Tabla
          title="Lista de Usuarios"
          headers={[...headers]}
          data={mappedUsuarios}
          onClickAction={openModalHandler}
          onUpdate={handleUpdate}
        />
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
