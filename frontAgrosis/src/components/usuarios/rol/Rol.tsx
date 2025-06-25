import { useState, useCallback, useEffect } from "react";
import { useRoles } from "@/hooks/usuarios/rol/useRol";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearRol from "./crearRol";


const Rol = () => {
  const navigate = useNavigate();
  const { data: rol, isLoading, error, refetch } = useRoles();
  const [modoCreacion, setModoCreacion] = useState(false);
  const [selectedRol, setSelectedRol] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  const openModalHandler = useCallback((rol: Record<string, any>) => {
    setSelectedRol(rol);
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (ficha: Record<string, any>) => {
    navigate(`/editarRol/${ficha.id}`);
  };

  const handleCreate = () => {
    if (esAdministrador) {
      setModoCreacion(true);
      setIsModalOpen(true);
    } else {
      setMensaje("No tienes permisos para crear un rol.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedRol(null);
    setModoCreacion(false);
    setIsModalOpen(false);
    refetch();
  }, []);

  const headers = [
    "ID",
    "Rol",
    "Fecha creacion"
  ];

  return (
    <>
    <div className="overflow-x-auto rounded-lg p-4">
      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}

      {isLoading && <div className="text-center text-gray-500">Cargando roles...</div>}

      {error instanceof Error && (
        <div className="text-center text-red-500">
          Error al cargar las fichas: {error.message}
        </div>
      )}

      {!isLoading && !error && (!Array.isArray(rol) || rol.length === 0) && (
        <div className="text-center text-gray-500">No hay fichas registradas.</div>
      )}

      {Array.isArray(rol) && rol.length > 0 && (
        <Tabla
          title="Lista de Roles"
          headers={headers}
          data={rol.map((rol) => ({
            id: rol.id,
            rol: rol.rol,
            fecha_creacion: rol.fecha_creacion,
          }))}
          onClickAction={openModalHandler}
          onUpdate={handleUpdate}
          onCreate={handleCreate}
          createButtonTitle="crear"
        />
      )}

{isModalOpen && (
  <VentanaModal
    isOpen={isModalOpen}
    onClose={closeModal}
    titulo={modoCreacion ? "" : "Detalles de rol"}
    contenido={
      modoCreacion ? (
        <CrearRol onClose={closeModal} onCreated={refetch} />
      ) : selectedRol && (
        <div>
          <p><strong>Rol:</strong> {selectedRol.rol}</p>
          <p><strong>Fecha creacion:</strong> {selectedRol.fecha_creacion}</p>
        </div>
      )
    }
  />
)}
    </div>
    </>
  );
};

export default Rol;
