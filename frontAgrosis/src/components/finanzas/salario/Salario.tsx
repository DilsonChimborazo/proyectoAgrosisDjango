import { useState } from "react";
import { useSalario } from "../../../hooks/finanzas/salario/useSalario";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import CrearSalario from "./CrearSalario";

const Salarios = () => {
  const { data: salarios, isLoading, error, refetch: refetchSalarios } = useSalario();
  const [selectedSalario, setSelectedSalario] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openDetailsModal = (salario: object) => {
    setSelectedSalario(salario);
    setModalContenido(null);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedSalario(null);
    setModalContenido(<CrearSalario onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSalario(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchSalarios();
    closeModal();
  };

  const handleRowClick = (salario: { id: number }) => {
    const originalSalario = salarios?.find((s: any) => s.id === salario.id);
    if (originalSalario) {
      openDetailsModal(originalSalario);
    }
  };

  if (isLoading) return <div>Cargando salarios...</div>;
  if (error instanceof Error)
    return <div>Error al cargar los salarios: {error.message}</div>;

  const salariosList = Array.isArray(salarios) ? salarios : [];

  const mappedSalarios = salariosList.map((salario: any) => {
    const precio = typeof salario.precio_jornal === 'string'
      ? parseFloat(salario.precio_jornal)
      : Number(salario.precio_jornal);

    return {
      id: salario.id,
      rol: salario.fk_id_rol?.rol || "Sin rol",
      precio_jornal: `$${precio.toFixed(2)}`,
      horas_por_jornal: `${salario.horas_por_jornal} hrs`,
      fecha_inicio: salario.fecha_inicio, // Usar el formato original
      fecha_fin: salario.fecha_fin || "Aún vigente",
      estado: salario.activo ? "Activo" : "Inactivo",
    };
  });

  const headers = ["ID", "Rol", "Precio Jornal", "Horas por Jornal", "Fecha Inicio", "Fecha Fin", "Estado"];

  return (
    <div className="overflow-x-auto shadow-md rounded-lg">
      <Tabla
        title="Salarios Registrados"
        headers={headers}
        data={mappedSalarios}
        onCreate={openCreateModal}
        createButtonTitle="Crear Salario"
      />

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={selectedSalario ? "Detalles del Salario" : "Crear Salario"}
          contenido={
            selectedSalario ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {(selectedSalario as any).id}</p>
                <p><strong>Rol:</strong> {(selectedSalario as any).fk_id_rol?.rol || "Sin rol"}</p>
                <p>
                  <strong>Precio Jornal:</strong> $
                  {Number((selectedSalario as any).precio_jornal).toFixed(2) || "0.00"}
                </p>
                <p><strong>Horas por Jornal:</strong> {(selectedSalario as any).horas_por_jornal || "0"} hrs</p>
                <p><strong>Fecha Inicio:</strong> {(selectedSalario as any).fecha_inicio}</p>
                <p><strong>Fecha Fin:</strong> {(selectedSalario as any).fecha_fin || "Aún vigente"}</p>
                <p><strong>Estado:</strong> {(selectedSalario as any).activo ? "Activo" : "Inactivo"}</p>
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

export default Salarios;