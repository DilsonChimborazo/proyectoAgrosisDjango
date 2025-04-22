import { useState } from 'react';
import { usePea } from '../../../hooks/trazabilidad/pea/usePea';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearPea from './CrearPea';
import ActualizarPea from './ActualizarPea';

const Pea = () => {
  const { data: peas, isLoading, error, refetch: refetchPeas } = usePea();
  const [selectedPea, setSelectedPea] = useState<object | null>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openModalHandler = (pea: object, type: "details" | "update") => {
    setSelectedPea(pea);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null);
    } else if (type === "update" && "id" in pea) {
      setModalContenido(
        <ActualizarPea
          id={(pea as any).id}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedPea(null);
    setModalType("create");
    setModalContenido(<CrearPea onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPea(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchPeas();
    closeModal();
  };

  const handleRowClick = (pea: { id: number }) => {
    const originalPea = peas?.find((p: any) => p.id === pea.id);
    if (originalPea) {
      openModalHandler(originalPea, "details");
    }
  };

  const handleUpdateClick = (pea: { id: number }) => {
    const originalPea = peas?.find((p: any) => p.id === pea.id);
    if (originalPea) {
      openModalHandler(originalPea, "update");
    }
  };

  if (isLoading) return <div>Cargando PEA...</div>;
  if (error instanceof Error) return <div>Error al cargar los PEA: {error.message}</div>;

  const peasList = Array.isArray(peas) ? peas : [];

  const mappedPeas = peasList.map((pea: any) => ({
    id: pea.id,
    nombre_pea: pea.nombre_pea,
    descripcion: pea.descripcion,
    tipo_pea: pea.tipo_pea,
  }));

  const headers = ['ID', 'Nombre Pea', 'Descripcion', 'Tipo Pea'];

  return (
    <div className="overflow-x-auto rounded-lg">
      <Tabla
        title="PEA (Plaga/Enfermedad/Arvense)"
        headers={headers}
        data={mappedPeas}
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
              ? "Detalles del PEA"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedPea ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedPea as any).id}</p>
                <p><strong>Nombre PEA:</strong> {(selectedPea as any).nombre_pea || "Sin nombre"}</p>
                <p><strong>Descripción:</strong> {(selectedPea as any).descripcion || "Sin descripción"}</p>
                <p><strong>Tipo PEA:</strong> {(selectedPea as any).tipo_pea || "Sin tipo"}</p>
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

export default Pea;