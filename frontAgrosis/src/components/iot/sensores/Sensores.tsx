import { useState } from 'react';
import { useSensores } from '../../../hooks/iot/sensores/useSensores';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearSensor from './CrearSensor';
import EditarSensor from './EditarSensores';

const Sensores = () => {
  const { data: sensores, error, isLoading, refetch } = useSensores();
  const [selectedSensor, setSelectedSensor] = useState<any>(null);
  const [modalType, setModalType] = useState<"details" | "create" | "update" | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openModalHandler = (sensor: object, type: "details" | "update") => {
    setSelectedSensor(sensor);
    setModalType(type);

    if (type === "details") {
      setModalContenido(null);
    } else if (type === "update" && "id" in sensor) {
      setModalContenido(
        <EditarSensor
          id={(sensor as any).id.toString()}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedSensor(null);
    setModalType("create");
    setModalContenido(<CrearSensor onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedSensor(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetch();
    closeModal();
  };

  const handleRowClick = (sensor: { id: number }) => {
    const originalSensor = sensores?.find((s: any) => s.id === sensor.id);
    if (originalSensor) {
      openModalHandler(originalSensor, "details");
    }
  };

  const handleUpdateClick = (sensor: { id: number }) => {
    const originalSensor = sensores?.find((s: any) => s.id === sensor.id);
    if (originalSensor) {
      openModalHandler(originalSensor, "update");
    }
  };

  const headers = ['ID', 'Nombre', 'Tipo', 'Unidad', 'Descripcion', 'Medida Minima', 'Medida Maxima'];

  if (isLoading) return <div className="text-center text-gray-500">Cargando...</div>;
  if (error) return <div className="text-center text-red-500">Error al cargar los datos: {error.message}</div>;

  const tablaData = (sensores ?? []).map(sensor => ({
    id: sensor.id,
    nombre: sensor.nombre_sensor,
    tipo: sensor.tipo_sensor,
    unidad: sensor.unidad_medida,
    descripcion: sensor.descripcion,
    medida_minima: sensor.medida_minima,
    medida_maxima: sensor.medida_maxima,
  }));

  return (
    <div className="mx-auto p-4 shadow-md rounded-lg">
      <Tabla
        title="Lista de Sensores"
        headers={headers}
        data={tablaData}
        onClickAction={handleRowClick}
        onUpdate={handleUpdateClick}
        onCreate={openCreateModal}
        createButtonTitle="Crear"
      />

      {isModalOpen && (
        <VentanaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          titulo={
            modalType === "details"
              ? "Detalles del Sensor"
              : modalType === "create"
              ? ""
              : ""
          }
          contenido={
            modalType === "details" && selectedSensor ? (
              <div className="grid grid-cols-2 gap-4">
                <p><strong>ID:</strong> {selectedSensor.id}</p>
                <p><strong>Nombre:</strong> {selectedSensor.nombre_sensor || "Sin nombre"}</p>
                <p><strong>Tipo:</strong> {selectedSensor.tipo_sensor || "Sin tipo"}</p>
                <p><strong>Unidad:</strong> {selectedSensor.unidad_medida || "Sin unidad"}</p>
                <p><strong>Descripción:</strong> {selectedSensor.descripcion || "Sin descripción"}</p>
                <p><strong>Medida Mínima:</strong> {selectedSensor.medida_minima ?? "No definida"}</p>
                <p><strong>Medida Máxima:</strong> {selectedSensor.medida_maxima ?? "No definida"}</p>
              </div>
            ) : (
              modalContenido
            )
          }
        />
      )}
    </div>
  );
};

export default Sensores;