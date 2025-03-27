import { useState } from 'react';
import { useLotes } from '../../../hooks/iot/lote/useLotes';
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';
import Button from "@/components/globales/Button";
import { useNavigate } from "react-router-dom";

const Lotes = () => {
  const { data: lotes, isLoading, error } = useLotes();
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

  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/Editarlote/${residuo.id}`);
  };

  const headers = ['ID', 'Nombre', 'Dimencion', 'fk id ubicacion', 'Estado'];

  const handleRowClick = (lote: object) => {
    openModalHandler(lote);
  };
  const handleCreate = () => {
    navigate("/Crear-lote");
  };

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error instanceof Error) return <div>Error al cargar los lotes: {error.message}</div>;

  const lotesList = Array.isArray(lotes) ? lotes : [];

  const mappedLotes = lotesList.map(lote => ({
    id: lote.id,
    nombre: lote.nombre_lote,
    dimencion: lote.dimencion,
    fk_id_ubicacion: lote.fk_id_ubicacion 
      ? `${lote.fk_id_ubicacion.latitud}, ${lote.fk_id_ubicacion.longitud}` 
      : 'Sin ubicación',
    estado: lote.estado,
  }));

  return (
    <div className="overflow-x-auto  rounded-lg">
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
