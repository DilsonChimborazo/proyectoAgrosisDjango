import { useState } from 'react';
import { useSensores } from '../../../hooks/iot/sensores/useSensores';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import { useNavigate } from "react-router-dom";

const Sensores = () => {
  const navigate = useNavigate();
  const { data: sensores, error, isLoading } = useSensores();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<any>(null);

  // Función para abrir el modal con un sensor seleccionado
  const openModal = (sensor: any) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSensor(null);
  };

  const handleUpdate = (residuo: { id: number }) => {
    navigate(`/EditarSensor/${residuo.id}`);
  };

  const handleCreate = () => {
    navigate("/Crear-Sensor");
  };

  // Si los datos aún están cargando
  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;

  // Si hay un error
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  // Mapeo de datos para la tabla
  const tablaData = (sensores ?? []).map(sensor => ({
    id: sensor.id,
    nombre: sensor.nombre_sensor,
    tipo: sensor.tipo_sensor,
    unidad: sensor.unidad_medida,
    descripción: sensor.descripcion,
    medida_minima: sensor.medida_minima,
    medida_maxima: sensor.medida_maxima,
  }));

  const headers = ['ID', 'Nombre', 'Tipo', 'Unidad', 'Descripción', 'medida minima', 'medida maxima'];

  return (
    <div className="mx-auto p-4">

      <Tabla
        title="Lista de Sensores"
        headers={headers}
        data={tablaData}
        onClickAction={openModal}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear"
      />

      {selectedSensor && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo="Detalles del Sensor"
          contenido={selectedSensor}
        />
      )}
    </div>
  );
};

export default Sensores;
