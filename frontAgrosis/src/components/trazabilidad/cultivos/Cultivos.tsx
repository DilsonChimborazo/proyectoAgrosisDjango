import { useState } from "react";
import { useCultivo } from "../../../hooks/trazabilidad/cultivo/useCultivo";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import CrearCultivo from "../cultivos/CrearCultivos";
import ActualizarCultivo from "../cultivos/ActualizarCultivo";

const Cultivos = () => {
  const { data: cultivos, isLoading, error, refetch: refetchCultivos } = useCultivo();
  const [selectedCultivo, setSelectedCultivo] = useState<object | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openModalHandler = (cultivo: object, type: "details" | "update") => {
    setSelectedCultivo(cultivo);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null); 
    } else if (type === "update" && "id" in cultivo) {
      setModalContenido(
        <ActualizarCultivo
          id={(cultivo as any).id}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedCultivo(null);
    setModalType("create");
    setModalContenido(<CrearCultivo onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCultivo(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchCultivos();
    closeModal();
  };

  const handleRowClick = (cultivo: { id: number }) => {
    const originalCultivo = cultivos?.find((c: any) => c.id === cultivo.id);
    if (originalCultivo) {
      openModalHandler(originalCultivo, "details");
    }
  };

  const handleUpdateClick = (cultivo: { id: number }) => {
    const originalCultivo = cultivos?.find((c: any) => c.id === cultivo.id);
    if (originalCultivo) {
      openModalHandler(originalCultivo, "update");
    }
  };

  if (isLoading) return <div>Cargando cultivos...</div>;
  if (error instanceof Error)
    return <div>Error al cargar los cultivos: {error.message}</div>;

  const cultivosList = Array.isArray(cultivos) ? cultivos : [];

  const mappedCultivos = cultivosList.map((cultivo: any) => ({
    id: cultivo.id,
    nombre: cultivo.nombre_cultivo,
    fecha_plantacion: new Date(cultivo.fecha_plantacion).toLocaleDateString(),
    descripcion: cultivo.descripcion,
    especie: cultivo.fk_id_especie ? cultivo.fk_id_especie.nombre_comun : "Sin especie",
    semillero: cultivo.fk_id_semillero ? cultivo.fk_id_semillero.nombre_semilla : "Sin semillero",
  }));

  const headers = ["ID", "Nombre", "Fecha Plantacion", "Descripcion", "Especie", "Semillero"];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <Tabla
        title="Cultivos Registrados"
        headers={headers}
        data={mappedCultivos}
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
              ? "Detalles del Cultivo"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedCultivo ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedCultivo as any).id}</p>
                <p><strong>Nombre:</strong> {(selectedCultivo as any).nombre_cultivo || "Sin nombre"}</p>
                <p>
                  <strong>Fecha de Plantación:</strong>{" "}
                  {new Date((selectedCultivo as any).fecha_plantacion).toLocaleDateString()}
                </p>
                <p><strong>Descripción:</strong> {(selectedCultivo as any).descripcion || "Sin descripción"}</p>
                <p>
                  <strong>Especie:</strong>{" "}
                  {(selectedCultivo as any).fk_id_especie?.nombre_comun || "Sin especie"}
                </p>
                <p>
                  <strong>Semillero:</strong>{" "}
                  {(selectedCultivo as any).fk_id_semillero?.nombre_semilla || "Sin semillero"}
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

export default Cultivos;