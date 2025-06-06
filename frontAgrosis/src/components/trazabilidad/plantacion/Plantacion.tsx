import { useState } from 'react';
import { usePlantacion } from '../../../hooks/trazabilidad/plantacion/usePlantacion';
import { useCultivo } from '../../../hooks/trazabilidad/cultivo/useCultivo';
import { useSemilleros } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearPlantacion from './CrearPlantacion';
import ActualizarPlantacion from './ActualizarPlantacion';

const Plantacion = () => {
  const { data: plantaciones, isLoading, error, refetch: refetchPlantaciones } =
    usePlantacion();
  const { isLoading: isLoadingCultivos } = useCultivo();
  const { isLoading: isLoadingSemilleros } = useSemilleros();

  const [selectedPlantacion, setSelectedPlantacion] = useState<object | null>(null);
  const [modalType, setModalType] = useState<'details' | 'create' | 'update' | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);
  selectedPlantacion

  const openModalHandler = (plantacion: object, type: 'details' | 'update') => {
    setSelectedPlantacion(plantacion);
    setModalType(type);

    // Abre el modal según el tipo seleccionado
    if (type === 'details') {
      setModalContenido(null);  // No hay contenido para el modal de detalles
    } else if (type === 'update' && 'id' in plantacion) {
      setModalContenido(
        <ActualizarPlantacion
          id={(plantacion as any).id}
          onSuccess={handleSuccess}
        />
      );
    }

    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setSelectedPlantacion(null);
    setModalType('create');
    setModalContenido(<CrearPlantacion onSuccess={handleSuccess} />);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedPlantacion(null);
    setModalType(null);
    setModalContenido(null);
    setIsModalOpen(false);
  };

  const handleSuccess = () => {
    refetchPlantaciones();
    closeModal();
  };

  const handleRowClick = (plantacion: { id: number }) => {
    const originalPlantacion = plantaciones?.find((p: any) => p.id === plantacion.id);
    if (originalPlantacion) {
      openModalHandler(originalPlantacion, 'details');
    }
  };

  const handleUpdateClick = (plantacion: { id: number }) => {
    const originalPlantacion = plantaciones?.find((p: any) => p.id === plantacion.id);
    if (originalPlantacion) {
      openModalHandler(originalPlantacion, 'update');
    }
  };

  if (isLoading || isLoadingCultivos || isLoadingSemilleros) {
    return <div>Cargando plantaciones...</div>;
  }

  if (error instanceof Error) {
    return <div>Error al cargar las plantaciones: {error.message}</div>;
  }

  const plantacionesList = Array.isArray(plantaciones) ? plantaciones : [];

  const mappedPlantaciones = plantacionesList.map((plantacion: any) => {
    // Split the fecha_plantacion string (expected format: YYYY-MM-DD)
    const [year, month, day] = plantacion.fecha_plantacion.split('-');
    const fechaFormateada = `${day}/${month}/${year}`;

    return {
      id: plantacion.id,
      cultivo: plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
      era: plantacion.fk_id_eras?.descripcion || 'Sin era',
      cantidad_transplante: plantacion.cantidad_transplante,
      fecha_plantacion: fechaFormateada, // Use the manually formatted date
      semillero: plantacion.fk_id_semillero?.nombre_semilla || 'Sin semillero',
    };
  });

  const headers = [
    'ID',
    'Cultivo',
    'Era',
    'Cantidad Transplante',
    'Fecha Plantacion',
    'Semillero',
  ];

  return (
    <div className="p-6">
      <div className="overflow-x-auto shadow-md rounded-lg">
        <Tabla
          title="Plantaciones Registradas"
          headers={headers}
          data={mappedPlantaciones}
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
              modalType === 'details'
                ? 'Detalles de Plantación'
                : modalType === 'create'
                ? ''
                : ''
            }
          >
            {modalContenido}
          </VentanaModal>
        )}
      </div>
    </div>
  );
};

export default Plantacion;
