import { useState } from 'react';
import { useEspecie } from '@/hooks/trazabilidad/especie/useEspecie';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Button from '../../globales/Button';
import { useNavigate } from 'react-router-dom';

type Especie = {
  id: number;
  nombre_comun: string;
  nombre_cientifico: string;
  descripcion: string;
  fk_id_tipo_cultivo?: {
    nombre: string;
  };
};

const Especie = () => {
  const { data: especies, error, isLoading } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<Especie | null>(null);
  const navigate = useNavigate();

  const openModal = (especie: Especie) => {
    setSelectedEspecie(especie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedEspecie(null);
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  const headers = ['ID', 'Nombre Común', 'Nombre Científico', 'Descripción', 'Tipo de Cultivo', 'Acciones'];

  const tablaData = especies?.map((especie) => ({
    id: especie.id,
    nombre_comun: especie.nombre_comun,
    nombre_cientifico: especie.nombre_cientifico,
    descripcion: especie.descripcion,
    tipo_cultivo: especie.fk_id_tipo_cultivo?.nombre || 'Sin tipo de cultivo',
    acciones: (
      <button
        className="bg-blue-500 text-white px-3 py-1 rounded"
        onClick={() => navigate(`/actualizarEspecie/${especie.id}`)}
      >
        Editar
      </button>
    ),
  }));

  return (
    <div className="mx-auto p-4">
      <Button text="Crear Especie" className="mx-2" onClick={() => navigate("/CrearEspecie")} variant="green" />
      <Tabla 
      title="Lista de Especies" 
      headers={headers} 
      data={tablaData || []} 
      onClickAction={openModal} 
      />

      {selectedEspecie && (
        <VentanaModal 
          isOpen={isModalOpen} 
          onClose={closeModal} 
          titulo="Detalles de la Especie"
          contenido={
            <div>
              <p><strong>ID:</strong> {selectedEspecie.id}</p>
              <p><strong>Nombre Común:</strong> {selectedEspecie.nombre_comun}</p>
              <p><strong>Nombre Científico:</strong> {selectedEspecie.nombre_cientifico}</p>
              <p><strong>Descripción:</strong> {selectedEspecie.descripcion}</p>
              <p><strong>Tipo de Cultivo:</strong> {selectedEspecie.fk_id_tipo_cultivo?.nombre || 'Sin tipo de cultivo'}</p>
            </div>
          }
        />
      )}
    </div>
  );
};

export default Especie;