import { useState, useCallback, useEffect } from "react";
import { UseFicha } from "@/hooks/usuarios/ficha/useFicha";
import { useNavigate } from "react-router-dom";
import Tabla from "@/components/globales/Tabla";
import VentanaModal from "@/components/globales/VentanasModales";
import CrearFicha from "./crearFicha";

const apiUrl = import.meta.env.VITE_API_URL;

const Fichas = () => {
  const navigate = useNavigate();
  const { data: fichas, isLoading, error, refetch } = UseFicha();
  const [modoCreacion, setModoCreacion] = useState(false);
  const [selectedFicha, setSelectedFicha] = useState<Record<string, any> | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);

  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;

    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  const openModalHandler = useCallback((ficha: Record<string, any>) => {
    setSelectedFicha(ficha);
    setIsModalOpen(true);
  }, []);

  const handleUpdate = (ficha: Record<string, any>) => {
    navigate(`/editarFicha/${ficha.id}`);
  };

  const handleCreate = () => {
    if (esAdministrador) {
      setModoCreacion(true);
      setIsModalOpen(true);
    } else {
      setMensaje("No tienes permisos para crear fichas.");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const closeModal = useCallback(() => {
    setSelectedFicha(null);
    setModoCreacion(false);
    setIsModalOpen(false);
  }, []);

  const handleToggleEstado = async (ficha: any) => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const accion = ficha.is_active ? "desactivar" : "activar";

    try {
      const response = await fetch(`${apiUrl}ficha/${ficha.id}/${accion}/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Error al cambiar estado");

      setMensaje(`Ficha ${accion === "activar" ? "activada" : "desactivada"} exitosamente`);
      refetch();
      setTimeout(() => setMensaje(null), 3000);
    } catch (err) {
      setMensaje("No se pudo actualizar el estado de la ficha");
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const headers = [
    "ID",
    "Numero ficha",
    "Nombre",
    "Abreviacion",
    "Fecha inicio",
    "Fecha salida",
    "Estado",
  ];

  return (
    <>
    <div className="overflow-x-auto rounded-lg p-4">
      {mensaje && (
        <div className="mb-2 p-2 bg-red-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}

      {isLoading && <div className="text-center text-gray-500">Cargando fichas...</div>}

      {error instanceof Error && (
        <div className="text-center text-red-500">
          Error al cargar las fichas: {error.message}
        </div>
      )}

      {!isLoading && !error && (!Array.isArray(fichas) || fichas.length === 0) && (
        <div className="text-center text-gray-500">No hay fichas registradas.</div>
      )}

      {Array.isArray(fichas) && fichas.length > 0 && (
        <Tabla
          title="Lista de Fichas"
          headers={headers}
          data={fichas.map((ficha) => ({
            id: ficha.id,
            numero_ficha: ficha.numero_ficha,
            nombre: ficha.nombre_ficha,
            abreviacion: ficha.abreviacion,
            fecha_inicio: new Date(ficha.fecha_inicio).toLocaleDateString(),
            fecha_salida: new Date(ficha.fecha_salida).toLocaleDateString(),
            estado: esAdministrador ? (
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={ficha.is_active}
                  onChange={() => handleToggleEstado(ficha)}
                  className="sr-only"
                />
                <div
                  className={`w-11 h-6 rounded-full transition-colors duration-300 ${
                    ficha.is_active ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <div
                    className={`w-5 h-5 bg-white rounded-full shadow-md transform transition-transform duration-300
                    ${ficha.is_active ? "translate-x-6" : "translate-x-1"} mt-0.5 ml-0.5`}
                  ></div>
                </div>
              </label>
            ) : (
              <span className="text-sm text-gray-500">
                {ficha.is_active ? "Activa" : "Inactiva"}
              </span>
            ),
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
    titulo={modoCreacion ? "" : "Detalles de la Ficha"}
    contenido={
      modoCreacion ? (
        <CrearFicha onClose={closeModal} onCreated={refetch} />
      ) : selectedFicha && (
        <div>
          <p><strong>Número de ficha:</strong> {selectedFicha.numero_ficha}</p>
          <p><strong>Nombre:</strong> {selectedFicha.nombre_ficha}</p>
          <p><strong>Abreviación:</strong> {selectedFicha.abreviacion}</p>
          <p><strong>Fecha de inicio:</strong> {new Date(selectedFicha.fecha_inicio).toLocaleDateString()}</p>
          <p><strong>Fecha de salida:</strong> {new Date(selectedFicha.fecha_salida).toLocaleDateString()}</p>
          <p><strong>Estado:</strong> {selectedFicha.is_active ? "Activa" : "Inactiva"}</p>
        </div>
      )
    }
  />
)}
    </div>
    </>
  );
};

export default Fichas;
