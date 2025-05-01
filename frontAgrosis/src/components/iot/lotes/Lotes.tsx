import { useState, useEffect } from "react";
import { useLotes } from "../../../hooks/iot/lote/useLotes";
import PdfLotesActivos from '@/components/iot/lotes/PdfLotesActivos';
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import CrearLote from "./CrearLote";
import EditarLote from "./EditarLote";
import Switch from 'react-switch';
import { useNavigate } from "react-router-dom";

const Lotes = () => {
  const { data: lotes, isLoading, error, refetch } = useLotes();
  const [selectedLote, setSelectedLote] = useState<object | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [esAdministrador, setEsAdministrador] = useState(false);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const navigate = useNavigate();

  // Verificar si el usuario es administrador
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("user");
    const usuario = usuarioGuardado ? JSON.parse(usuarioGuardado) : null;
    setEsAdministrador(usuario?.fk_id_rol?.rol === "Administrador");
  }, []);

  const handleToggleStatus = async (lote: any) => {
    const token = localStorage.getItem('token');
    if (!token) {
      setMensaje('Debes iniciar sesión para realizar esta acción.');
      setTimeout(() => {
        setMensaje(null);
        navigate('/login');
      }, 3000);
      return;
    }

    if (!esAdministrador) {
      setMensaje('No tienes permisos de administrador para realizar esta acción.');
      setTimeout(() => setMensaje(null), 3000);
      return;
    }

    const action = lote.estado === "Activo" ? "desactivar" : "activar";
    const url = `http://localhost:8000/api/lotes/${lote.id}/${action}/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Error al ${action} el lote`);
      }

      refetch();
      setTimeout(() => setMensaje(null), 3000);
    } catch (error) {
      setTimeout(() => setMensaje(null), 3000);
      console.error(`Error al ${action} el lote:`, error);
    }
  };

  const openModalHandler = (lote: object, type: "details" | "update") => {
    setSelectedLote(lote);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null);
    } else if (type === "update" && "id" in lote) {
      setModalContenido(
        <EditarLote
          id={(lote as any).id.toString()}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    if (!esAdministrador) {
      setMensaje("No tienes permisos para crear lotes.");
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    setSelectedLote(null);
    setModalType("create");
    setModalContenido(<CrearLote onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLote(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetch();
    closeModal();
  };

  const handleRowClick = (lote: { id: number }) => {
    const originalLote = lotes?.find((l: any) => l.id === lote.id);
    if (originalLote) {
      openModalHandler(originalLote, "details");
    }
  };

  const handleUpdateClick = (lote: { id: number }) => {
    if (!esAdministrador) {
      setMensaje("No tienes permisos para editar lotes.");
      setTimeout(() => setMensaje(null), 3000);
      return;
    }
    const originalLote = lotes?.find((l: any) => l.id === lote.id);
    if (originalLote) {
      openModalHandler(originalLote, "update");
    }
  };

  const headers = ["ID", "Nombre", "Dimencion", "Estado"];

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error instanceof Error) {
    return (
      <div>
        Error al cargar lotes: {error.message}
        {error.message.includes('inicia sesión') && (
          <button
            onClick={() => navigate('/login')}
            className="ml-4 text-blue-600 hover:underline"
          >
            Iniciar sesión
          </button>
        )}
      </div>
    );
  }

  const lotesList = Array.isArray(lotes) ? lotes : [];

  const mappedLotes = lotesList.map((item) => ({
    id: item.id,
    nombre: item.nombre_lote,
    dimencion: item.dimencion,
    estado: esAdministrador ? (
      <Switch
        onChange={() => handleToggleStatus(item)}
        checked={item.estado}
        onColor="#2563EB"
        offColor="#D1D5DB"
        uncheckedIcon={false}
        checkedIcon={false}
        height={20}
        width={40}
        handleDiameter={16}
      />
    ) : (
      <span className="text-sm text-gray-500">
        {item.estado ? "Activo" : "Inactivo"}
      </span>
    ),
  }));

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      {mensaje && (
        <div className="mb-2 p-2 bg-yellow-500 text-white text-center rounded-md">
          {mensaje}
        </div>
      )}
      <Tabla
        title="Lotes Registrados"
        headers={headers}
        data={mappedLotes}
        onClickAction={handleRowClick}
        onUpdate={handleUpdateClick}
        onCreate={openCreateModal}
        createButtonTitle="Crear"
        extraButton={<PdfLotesActivos />}
      />

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={
            modalType === "details"
              ? "Detalles del Lote"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedLote ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedLote as any).id}</p>
                <p><strong>Nombre:</strong> {(selectedLote as any).nombre_lote || "Sin nombre"}</p>
                <p><strong>Dimensión:</strong> {(selectedLote as any).dimencion || "Sin dimención"}</p>
                <p><strong>Estado:</strong> {(selectedLote as any).estado ? "Activo" : "Inactivo"}</p>
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

export default Lotes;