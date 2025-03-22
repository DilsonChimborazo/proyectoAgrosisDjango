import { useState } from 'react';
import { useSemilleros } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import Button from '../../globales/Button';
import { useNavigate } from 'react-router-dom';

const Semillero = () => {
  const { data: semillas, error, isLoading } = useSemilleros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemilla, setSelectedSemilla] = useState<any>(null);

  // Función para abrir el modal con una semilla seleccionada
  const openModal = (semilla: any) => {
    setSelectedSemilla(semilla);
    setIsModalOpen(true);
  };

  const navigate=useNavigate()

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSemilla(null);
  };

  const handleUpdate = (cultivo: { id: number }) => {
    navigate(`/actualizarSemillero/${cultivo.id}`);
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Verificar que 'semillas' es un arreglo antes de mapear
  const tablaData = Array.isArray(semillas) ? semillas.map((semilla) => ({
    id: semilla.id,

    nombre_semilla: semilla.nombre_semillero,
    fecha_siembra: semilla.fecha_siembra,
    fecha_estimada: semilla.fecha_estimada,
    cantidad: semilla.cantidad,
    acciones: (
      <button 
          className="bg-blue-500 text-white px-3 py-1 rounded" 
          onClick={() => navigate(`/actualizarSemillero/${semilla.id}`)}
      >
          Editar
      </button>
  ),
  })) : [];

  const headers = ['ID Semillero', 'Nombre Semilla', 'Fecha de Siembra', 'Fecha Estimada', 'Cantidad'];

  return (
    <div className="mx-auto p-4">

      <Button text="Crear Semillero" className='mx-2' onClick={() => navigate("/CrearSemillero") } variant="green" />
      <Tabla
        title="Lista de Semilleros"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
      />

      {selectedSemilla && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Semillero"
          contenido={selectedSemilla}
        />
      )}
    </div>
  );
};

export default Semillero;
