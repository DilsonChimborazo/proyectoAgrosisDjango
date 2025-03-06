import { useState } from 'react';
import { useCultivo} from '../../hooks/trazabilidad/useCultivo';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';


const Cultivos = () => {
  const { data: cultivos, isLoading, error } = useCultivo();
  const [selectedCultivo, setSelectedCultivo] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (cultivo: object) => {
    setSelectedCultivo(cultivo);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedCultivo(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Fecha de Plantación', 'Descripción', 'Especie', 'Semillero'];

  const handleRowClick = (cultivo: object) => {
    openModalHandler(cultivo);
  };

  if (isLoading) return <div>Cargando cultivos...</div>;
  if (error instanceof Error) return <div>Error al cargar los cultivos: {error.message}</div>;

  const cultivosList = Array.isArray(cultivos) ? cultivos : [];

  const mappedCultivos = cultivosList.map(cultivo => ({
    nombre: cultivo.nombre_cultivo,
    fecha_plantacion: new Date(cultivo.fecha_plantacion).toLocaleDateString(),
    descripcion: cultivo.descripcion,
    especie: cultivo.fk_id_especie ? cultivo.fk_id_especie.nombre_comun : 'Sin especie',
    semillero: cultivo.fk_id_semillero ? cultivo.fk_id_semillero.nombre_semillero : 'Sin semillero',
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        title="Cultivos"
        headers={headers}
        data={mappedCultivos}
        onClickAction={handleRowClick}
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