import { useState } from 'react';
import { useResiduos } from '../../../hooks/trazabilidad/residuo/useResiduos';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearResiduo from './CrearResiduo';
import ActualizarResiduo from './ActualizarResiduo';

const Residuos = () => {
  const { data: residuos, isLoading, error, refetch: refetchResiduos } = useResiduos();
  const [selectedResiduo, setSelectedResiduo] = useState<object | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openModalHandler = (residuo: object, type: "details" | "update") => {
    setSelectedResiduo(residuo);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null);
    } else if (type === "update" && "id" in residuo) {
      setModalContenido(
        <ActualizarResiduo
          id={(residuo as any).id}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedResiduo(null);
    setModalType("create");
    setModalContenido(<CrearResiduo onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedResiduo(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchResiduos();
    closeModal();
  };

  const handleRowClick = (residuo: { id: number }) => {
    const originalResiduo = residuos?.find((r: any) => r.id === residuo.id);
    if (originalResiduo) {
      openModalHandler(originalResiduo, "details");
    }
  };

  const handleUpdateClick = (residuo: { id: number }) => {
    const originalResiduo = residuos?.find((r: any) => r.id === residuo.id);
    if (originalResiduo) {
      openModalHandler(originalResiduo, "update");
    }
  };

  if (isLoading) return <div>Cargando residuos...</div>;
  if (error instanceof Error) return <div>Error al cargar los residuos: {error.message}</div>;

  const residuosList = Array.isArray(residuos) ? residuos : [];

  const mappedResiduos = residuosList.map((residuo: any) => ({
    id: residuo.id,
    nombre: residuo.nombre,
    fecha: new Date(residuo.fecha).toLocaleDateString(),
    descripcion: residuo.descripcion,
    cultivo: residuo.fk_id_cultivo ? residuo.fk_id_cultivo.nombre_cultivo : 'Sin cultivo',
    tipo_residuo: residuo.fk_id_tipo_residuo ? residuo.fk_id_tipo_residuo.nombre : 'Sin tipo',
  }));

  const headers = ['ID', 'Nombre', 'Fecha', 'Descripcion', 'Cultivo', 'Tipo Residuo'];

  return (
    <div className="overflow-x-auto rounded-lg">
      <Tabla
        title="Residuos Registrados"
        headers={headers}
        data={mappedResiduos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdateClick}
        onCreate={openCreateModal}
        createButtonTitle="Crear"
      />

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={
            modalType === "details"
              ? "Detalles del Residuo"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedResiduo ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedResiduo as any).id}</p>
                <p><strong>Nombre:</strong> {(selectedResiduo as any).nombre || "Sin nombre"}</p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date((selectedResiduo as any).fecha).toLocaleDateString()}
                </p>
                <p><strong>Descripción:</strong> {(selectedResiduo as any).descripcion || "Sin descripción"}</p>
                <p>
                  <strong>Cultivo:</strong>{" "}
                  {(selectedResiduo as any).fk_id_cultivo?.nombre_cultivo || "Sin cultivo"}
                </p>
                <p>
                  <strong>Tipo de Residuo:</strong>{" "}
                  {(selectedResiduo as any).fk_id_tipo_residuo?.nombre || "Sin tipo"}
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

export default Residuos;