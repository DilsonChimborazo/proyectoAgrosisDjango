
import { useState } from 'react';
import { useEspecie } from '../../hooks/trazabilidad/useEspecie'; // Hook para obtener las especies
import VentanaModal from '../globales/VentanasModales';
import Tabla from '../globales/Tabla';
import Button from '../globales/Button';
import { useNavigate } from 'react-router-dom';

const Especie = () => {
  const { data: especies, error, isLoading } = useEspecie();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEspecie, setSelectedEspecie] = useState<any>(null);

  const navigate = useNavigate();

  // Función para abrir el modal con una especie seleccionada
  const openModal = (especie: any) => {
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

  // Verificar que 'especies' es un arreglo antes de mapear
  const tablaData = Array.isArray(especies) ? especies.map((especie) => ({
    id: especie.id, // ID de la especie
    nombre_comun: especie.nombre_comun, // Nombre común
    nombre_cientifico: especie.nombre_cientifico, // Nombre científico
    descripcion: especie.descripcion, // Descripción de la especie
    fk_id_tipo_cultivo: especie.fk_id_tipo_cultivo, // ID del tipo de cultivo
    acciones: (
      <button 
          className="bg-blue-500 text-white px-3 py-1 rounded" 
          onClick={() => navigate(`/actualizarEspecie/${especie.id}`)} // Navegar a actualizar especie
      >
          Editar
      </button>
    ),
  })) : [];

  const headers = ['ID Especie', 'Nombre Común', 'Nombre Científico', 'Descripción', 'ID Tipo de Cultivo', 'Acciones'];

  return (
    <div className="mx-auto p-4">
      <Button text="Crear Especie" className='mx-2' onClick={() => navigate("/CrearEspecie") } variant="success" />
      <Tabla
        title="Lista de Especies"
        headers={headers}
        data={tablaData}
        onClickAction={openModal} // Abrir modal al hacer clic en una fila
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

export default Especie;
