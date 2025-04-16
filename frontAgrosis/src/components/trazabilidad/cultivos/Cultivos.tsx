import { useState } from "react";
import { useCultivo } from "../../../hooks/trazabilidad/cultivo/useCultivo";
import VentanaModal from "../../globales/VentanasModales";
import Tabla from "../../globales/Tabla";
import { useNavigate } from "react-router-dom";

const Cultivos = () => {
  const { data: cultivos, isLoading, error } = useCultivo();
  const [selectedCultivo, setSelectedCultivo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (cultivo: object) => {
    setSelectedCultivo(cultivo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCultivo(null);
    setIsModalOpen(false);
  };

  const handleRowClick = (cultivo: { id: number }) => {
    openModalHandler(cultivo);
  };

  const handleUpdate = (cultivo: { id: number }) => {
    navigate(`/actualizarcultivo/${cultivo.id}`);
  };
  
  const handleCreate = () => {
    navigate("/crearcultivo");
  };

  if (isLoading) return <div>Cargando cultivos...</div>;
  if (error instanceof Error)
    return <div>Error al cargar los cultivos: {error.message}</div>;

  const cultivosList = Array.isArray(cultivos) ? cultivos : [];

  const mappedCultivos = cultivosList.map((cultivo) => ({
    id: cultivo.id,
    nombre: cultivo.nombre_cultivo,
    fecha_plantacion: new Date(cultivo.fecha_plantacion).toLocaleDateString(),
    descripcion: cultivo.descripcion,
    especie: cultivo.fk_id_especie
      ? cultivo.fk_id_especie.nombre_comun
      : "Sin especie",
    semillero: cultivo.fk_id_semillero
      ? cultivo.fk_id_semillero.nombre_semillero
      : "Sin semillero",
  }));

  const headers = [
    "ID",
    "Nombre",
    "Fecha Plantacion",
    "Descripcion",
    "Especie",
    "Semillero",
  ];

  return (
    <div className="overflow-x-auto  shadow-md rounded-lg">
      <Tabla
        title="Listar Cultivos"
        headers={[...headers]}
        data={mappedCultivos}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate} 
        onCreate={handleCreate}
        createButtonTitle="Crear"
        
      />

      {selectedCultivo && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Cultivo"
          contenido={selectedCultivo}
        />
      )}
    </div>
  );
};

export default Cultivos;
