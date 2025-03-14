import { useState } from 'react';
import { useHerramientas } from '../../hooks/inventario/herramientas/useHerramientas';
import Tabla from '../globales/Tabla';
import VentanaModal from '../globales/VentanasModales';

const herramientas = () => {
  const { data: herramientas, isLoading, error } = useHerramientas();
  const [selectedHerramientas, setSelectedHerramientas] = useState<object | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModalHandler = (herramientas: object) => {
    setSelectedHerramientas(herramientas);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedHerramientas(null);
    setIsModalOpen(false);
  };

  const headers = ['ID', 'Nombre', 'Estado', 'Fecha_Prestamo'];

  const handleRowClick = (herramientas: object) => {
    openModalHandler(herramientas);
  };

  if (isLoading) return <div>Cargando herramientas...</div>;
  if (error instanceof Error) return <div>Error al cargar la herramientas: {error.message}</div>;

  const HerramientasList = Array.isArray(herramientas) ? herramientas : [];

  const mappedHerramientas = HerramientasList.map(herramientas => ({
    id: herramientas.id_herramientas,
    nombre_h: herramientas.nombre_h,
    estado: herramientas.estado,
    fecha_prestamo: herramientas.fecha_prestamo,
  }));

  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg">
      <Tabla
        title="herramientas"
        headers={headers}
        data={mappedHerramientas}
        onClickAction={handleRowClick}
      />
      {selectedHerramientas && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Lote"
          contenido={selectedHerramientas} 
        />
      )}
    </div>
  );
};

export default herramientas;