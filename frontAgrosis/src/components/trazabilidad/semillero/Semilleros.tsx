import { useState } from 'react';
import { useSemilleros } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from 'react-router-dom';

const Semilleros = () => {
  const { data: semilleros, error, isLoading } = useSemilleros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSemillero, setSelectedSemillero] = useState<any>(null);

  const navigate = useNavigate();

  const openModal = (semillero: any) => {
    setSelectedSemillero(semillero);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSemillero(null);
  };

  const handleUpdate = (semillero: { id: number }) => {
    navigate(`/actualizarSemillero/${semillero.id}`);
  };

  const handleCreate = () => {
    navigate('/CrearSemillero');
  };

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  if (error)
    return (
      <div className="text-center text-red-500">
        Error al cargar los datos: {error.message}
      </div>
    );

  const tablaData = (semilleros ?? []).map((semillero) => ({
    id: semillero.id,
    nombre_semilla: semillero.nombre_semillero || 'Sin nombre',
    fecha_siembra: semillero.fecha_siembra
      ? new Date(semillero.fecha_siembra).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Sin fecha de siembra',
    fecha_estimada: semillero.fecha_estimada
      ? new Date(semillero.fecha_estimada).toLocaleDateString('es-ES', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      : 'Sin fecha estimada',
    cantidad: semillero.cantidad || 'No especificada',
  }));

  const headers = [
    'id',
    'Nombre Semilla',
    'Fecha Siembra',
    'Fecha Estimada',
    'Cantidad',
  ];

  return (
    <div className="">
      <Tabla
        title="Lista de Semilleros"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedSemillero && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Semillero"
          contenido={selectedSemillero}
        />
      )}
    </div>
  );
};

export default Semilleros;