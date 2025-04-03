import { useState } from "react";
import { useLotes } from "../../../hooks/iot/lote/useLotes";
import useLotesActivos from "../../../hooks/iot/lote/useLotesActivos"; // Importa el hook para generar PDF
import Tabla from "../../globales/Tabla";
import VentanaModal from "../../globales/VentanasModales";
import { useNavigate } from "react-router-dom";

const Lotes = () => {
  const { data: lotes, isLoading, error } = useLotes();
  const { generarPDF } = useLotesActivos(); // Hook para generar PDF
  const [selectedLote, setSelectedLote] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModalHandler = (lote: object) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLote(null);
    setIsModalOpen(false);
  };

  const handleUpdate = (lote: { id: number }) => {
    navigate(`/Editarlote/${lote.id}`);
  };

  const headers = ["ID", "Nombre", "dimencion", "ubicacion", "Estado"];

  const handleRowClick = (lote: object) => {
    openModalHandler(lote);
  };
  
  const handleCreate = () => {
    navigate("/Crear-lote");
  };

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error instanceof Error) return <div>Error al cargar los lotes: {error.message}</div>;

  const lotesList = Array.isArray(lotes) ? lotes : [];

  const mappedLotes = lotesList.map((lote) => ({
    id: lote.id,
    nombre: lote.nombre_lote,
    dimencion: lote.dimencion,
    ubicacion: lote.fk_id_ubicacion
      ? `${lote.fk_id_ubicacion.latitud}, ${lote.fk_id_ubicacion.longitud}`
      : "Sin ubicación",
    estado: lote.estado,
  }));

  return (
    <div className="overflow-x-auto rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">Lotes</h2>
        <button 
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
          onClick={generarPDF}
        >
          Descargar PDF
        </button>
      </div>
      
      <Tabla
        title="Lotes"
        headers={headers}
        data={mappedLotes}
        onClickAction={handleRowClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />
      
      {selectedLote && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Lote"
          contenido={selectedLote}
        />
      )}
    </div>
  );
};

export default Lotes;
