import { useState } from 'react';
import { useLotes } from '../../hooks/iot/useLotes';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const Lotes = () => {
  const { data: lotes, isLoading, error } = useLotes();
  const [selectedLote, setSelectedLote] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (lote: object) => {
    setSelectedLote(lote);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedLote(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Dimensión', 'Ubicación', 'Estado'];

  const handleRowClick = (lote: object) => {
    openModalHandler(lote);
  };

  if (isLoading) return <div>Cargando lotes...</div>;
  if (error instanceof Error) return <div>Error al cargar los lotes: {error.message}</div>;

  const lotesList = Array.isArray(lotes) ? lotes : [];

  const mappedLotes = lotesList.map(lote => ({
    id: lote.id,
    nombre: lote.nombre_lote,
    dimencion: lote.dimencion,
    ubicacion: lote.fk_id_ubicacion 
      ? `${lote.fk_id_ubicacion.latitud}, ${lote.fk_id_ubicacion.longitud}` 
      : 'Sin ubicación',
    estado: lote.estado,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        title="Lotes"
        headers={headers}
        data={mappedLotes}
        onClickAction={handleRowClick}
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
