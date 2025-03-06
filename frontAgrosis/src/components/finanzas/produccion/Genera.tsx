import { useState } from 'react';
import { useGenera } from '../../../hooks/finanzas/produccion/useGenera'; // Ajusta la ruta según tu estructura
import Tabla from '../../globales/Tabla';
import VentanaModal from '../../globales/VentanasModales';

const GeneraComponent = () => {
  const { data: genera, isLoading, error } = useGenera();
  const [selectedGenera, setSelectedGenera] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (genera: object) => {
    setSelectedGenera(genera);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedGenera(null);
    setIsModalOpen(false);
  };


  const headers = [
    "ID Genera",
    "Nombre Cultivo",
    "Fecha Plantación",
    "Cantidad Producción",
    "Fecha Producción"
  ];

  const handleRowClick = (genera: object) => {
    openModalHandler(genera);
  };

  if (isLoading) return <div>Cargando datos de genera...</div>;
  if (error instanceof Error) return <div>Error al cargar los datos: {error.message}</div>;

  const generaList = Array.isArray(genera) ? genera : [];


  const mappedGenera = generaList.map((genera) => ({
    id: genera.id_genera,
    nombre_cultivo: genera.fk_id_cultivo?.nombre_cultivo ?? "No disponible",
    fecha_plantacion: genera.fk_id_cultivo?.fecha_plantacion ?? "No disponible",
    cantidad_produccion: genera.fk_id_produccion?.cantidad_produccion ?? "No disponible",
    fecha_produccion: genera.fk_id_produccion?.fecha ?? "No disponible",
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla title="Producción" headers={headers} data={mappedGenera} onClickAction={handleRowClick} />
      {selectedGenera && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de Genera"
          contenido={selectedGenera}
        />
      )}
    </div>
  );
};

export default GeneraComponent;