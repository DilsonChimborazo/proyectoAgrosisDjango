import { useState, useEffect } from "react";
import { useLotes } from "../../../hooks/iot/lote/useLotes";
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import CrearLote from "./CrearLote";
import EditarLote from "./EditarLote";
import Switch from 'react-switch';
import { useNavigate } from "react-router-dom";
import DescargarTablaPDF from "../../globales/DescargarTablaPDF";

const Lotes = () => {
  const { data: lotes, isLoading, error, refetch } = useLotes();
  const [selectedLote, setSelectedLote] = useState<object | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  const [esAdministrador, setEsAdministrador] = useState(false);
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
      navigate('/login');
      return;
    }

    if (!esAdministrador) {
      return;
    }

    const action = lote.estado ? "desactivar" : "activar";
    const url = `${import.meta.env.VITE_API_URL}lote/${lote.id}/${action}/`;

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get("content-type");
        let errorMessage = `Error al ${action} el lote`;
        if (contentType && contentType.includes("application/json")) {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } else {
          errorMessage = `Error ${response.status}: ${response.statusText}`;
        }
        throw new Error(errorMessage);
      }

      refetch();
    } catch (error: any) {
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
      return;
    }
    const originalLote = lotes?.find((l: any) => l.id === lote.id);
    if (originalLote) {
      openModalHandler(originalLote, "update");
    }
  };

  const headers = ["ID", "Nombre", "dimencion", "Estado"];
  const columnasPDF = ["ID", "Nombre", "dimencion", "Estado"];
  const datosPDF = lotes && Array.isArray(lotes)
    ? lotes
        .sort((a, b) => (a.estado === b.estado ? 0 : a.estado ? -1 : 1))
        .map((lote) => [
          lote.id.toString(),
          lote.nombre_lote,
          lote.dimencion,
          lote.estado ? "Activo" : "Inactivo",
        ])
    : [];

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error instanceof Error) {
    return (
      <div>
        Error al cargar lotes: {error.message}
      </div>
    );
  }

  const lotesList = Array.isArray(lotes) ? lotes : [];

  const mappedLotes = lotesList
    .sort((a, b) => (a.estado === b.estado ? 0 : a.estado ? -1 : 1)) // Ordena: activos primero, inactivos después
    .map((item) => ({
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
        <span className={`text-sm ${item.estado ? "text-green-500" : "text-red-500"}`}>
          {item.estado ? "Activo" : "Inactivo"}
        </span>
      ),
      rowClassName: item.estado ? "bg-white" : "bg-gray-100" // Color de fondo según estado
    }));

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <Tabla
        title="Lotes Registrados"
        headers={headers}
        data={mappedLotes}
        onClickAction={handleRowClick}
        onUpdate={handleUpdateClick}
        onCreate={openCreateModal}
        createButtonTitle="Crear"
        extraButton={
          <DescargarTablaPDF
            nombreArchivo="LotesRegistrados.pdf"
            titulo="Reporte de Lotes Registrados"
            columnas={columnasPDF}
            datos={datosPDF}
          />
        }
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
                <p><strong>Dimensión:</strong> {(selectedLote as any).dimencion || "Sin dimensión"}</p>
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