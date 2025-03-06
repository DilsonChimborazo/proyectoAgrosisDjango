import { useState } from 'react';
import { useEspecie } from '../../hooks/trazabilidad/useEspecie';
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import { Especie } from '../../hooks/trazabilidad/useEspecie';

const Especies = () => {
  const { data: especies = [], error, isLoading } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<Especie | null>(null);

  // Función para abrir el modal con una especie seleccionada
  const openModal = (especie: Especie) => {
    setSelectedEspecie(especie);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEspecie(null);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Preparar datos para la tabla
  const tablaData = especies.map((especie) => ({
    ...especie, // Pasamos todo el objeto para evitar el error
    tipo_cultivo: especie.fk_id_tipo_cultivo?.nombre || 'Sin tipo de cultivo',
  }));

  const headers = ['ID', 'Nombre Común', 'Nombre Científico', 'Descripción', 'Tipo de Cultivo'];

  return (
    <div className="mx-auto p-4">
      <Tabla
        title="Lista de Especies"
        headers={headers}
        data={tablaData}
        onClickAction={(especie) => openModal(especie)}
      />

      {selectedEspecie && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles de la Especie"
          contenido={selectedEspecie}
        />
      )}
    </div>
  );
};

export default Especies;
