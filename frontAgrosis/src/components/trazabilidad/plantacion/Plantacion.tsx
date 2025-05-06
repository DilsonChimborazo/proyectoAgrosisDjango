import { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePlantacion } from '../../../hooks/trazabilidad/plantacion/usePlantacion';
import { useCultivo } from '../../../hooks/trazabilidad/cultivo/useCultivo';
import { useSemilleros } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearPlantacion from '../plantacion/CrearPlantacion';
import ActualizarPlantacion from '../plantacion/ActualizarPlantacion';
import Button from '../../globales/Button'; // Ajusta la ruta según tu estructura

const Plantacion = () => {
  const { data: plantaciones, isLoading, error, refetch: refetchPlantaciones } =
    usePlantacion();
  const { isLoading: isLoadingCultivos } = useCultivo();
  const { isLoading: isLoadingSemilleros } = useSemilleros();
  const [selectedPlantacion, setSelectedPlantacion] = useState<object | null>(
    null
  );
  const [modalType, setModalType] = useState<
    'details' | 'create' | 'update' | null
  >(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  const openModalHandler = (
    plantacion: object,
    type: 'details' | 'update'
  ) => {
    setSelectedPlantacion(plantacion);
    setModalType(type);

    if (type === 'details') {
      setModalContenido(null);
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
    const originalPlantacion = plantaciones?.find(
      (p: any) => p.id === plantacion.id
    );
    if (originalPlantacion) {
      openModalHandler(originalPlantacion, 'details');
    }
  };

  const handleUpdateClick = (plantacion: { id: number }) => {
    const originalPlantacion = plantaciones?.find(
      (p: any) => p.id === plantacion.id
    );
    if (originalPlantacion) {
      openModalHandler(originalPlantacion, 'update');
    }
  };

  if (
    isLoading ||
    isLoadingCultivos ||
    isLoadingSemilleros 
  ) {
    return <div>Cargando plantaciones...</div>;
  }
  if (error instanceof Error) {
    return <div>Error al cargar las plantaciones: {error.message}</div>;
  }

  const plantacionesList = Array.isArray(plantaciones) ? plantaciones : [];

  const mappedPlantaciones = plantacionesList.map((plantacion: any) => ({
    id: plantacion.id,
    cultivo: plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin cultivo',
    era: plantacion.fk_id_eras?.descripcion || 'Sin era',
    cantidad_transplante: plantacion.cantidad_transplante,
    fecha_plantacion: new Date(plantacion.fecha_plantacion).toLocaleDateString(),
    semillero: plantacion.fk_id_semillero?.nombre_semilla || 'Sin semillero',
  }));

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
      {/* Sección de Botones */}
      <div className="flex justify-start mb-4 gap-0.0">
        <Link to="/cultivo">
          <Button
            text="Cultivos"
            variant="success"
            onClick={() => {}}
            className="px-9 py-1.5 bg-green-600 text-white text-base rounded-md shadow-md hover:bg-green-700"
          />
        </Link>
        <Link to="/semilleros">
          <Button
            text="Semilleros"
            variant="success"
            onClick={() => {}}
            className="px-9 py-1.5 bg-green-600 text-white text-base rounded-md shadow-md hover:bg-green-700"
          />
        </Link>
      </div>

      {/* Tabla y resto del componente sin cambios */}
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
                ? 'Detalles de la Plantación'
                : modalType === 'create'
                ? ''
                : ''
            }
            contenido={
              modalType === 'details' && selectedPlantacion ? (
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>ID:</strong> {(selectedPlantacion as any).id}
                  </p>
                  <p>
                    <strong>Cultivo:</strong>{' '}
                    {(selectedPlantacion as any).fk_id_cultivo?.nombre_cultivo ||
                      'Sin cultivo'}
                  </p>
                  <p>
                    <strong>Era:</strong>{' '}
                    {(selectedPlantacion as any).fk_id_eras?.descripcion ||
                      'Sin era'}
                  </p>
                  <p>
                    <strong>Cantidad Transplante:</strong>{' '}
                    {(selectedPlantacion as any).cantidad_transplante}
                  </p>
                  <p>
                    <strong>Fecha Plantación:</strong>{' '}
                    {new Date(
                      (selectedPlantacion as any).fecha_plantacion
                    ).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Semillero:</strong>{' '}
                    {(selectedPlantacion as any).fk_id_semillero
                      ?.nombre_semilla || 'Sin semillero'}
                  </p>
                </div>
              ) : (
                modalContenido
              )
            }
          />
        )}
      </div>
    </div>
  );
};

export default Plantacion;


