import { useState } from 'react';
import { useEspecie } from '../../../hooks/trazabilidad/especie/useEspecie';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';

const Especies = () => {
  const { data: especies, error, isLoading } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<any>(null);

  const navigate = useNavigate();

  const openModal = (especie: any) => {
    setSelectedEspecie(especie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEspecie(null);
  };

  const handleUpdate = (especie: { id: number }) => {
    navigate(`/actualizarEspecie/${especie.id}`);
  };

  const handleCreate = () => {
    navigate('/CrearEspecie');
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  if (error)
    return (
      <div className="text-center text-red-500">
        Error al cargar los datos: {error.message}
      </div>
    );

  const tablaData = (especies ?? []).map((especie) => ({
    id: especie.id,
    nombre_comun: especie.nombre_comun || 'Sin nombre común',
    nombre_cientifico: especie.nombre_cientifico || 'Sin nombre científico',
    descripcion: especie.descripcion || 'Sin descripción',
    tipo_cultivo: especie.fk_id_tipo_cultivo?.nombre || 'Sin tipo de cultivo',
  }));

  const headers = ['id', 'Nombre Comun', 'Nombre Cientifico', 'descripcion', 'tipo cultivo'];

  return (
    <div className="">
      <Tabla
        title="Lista de Especies"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
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