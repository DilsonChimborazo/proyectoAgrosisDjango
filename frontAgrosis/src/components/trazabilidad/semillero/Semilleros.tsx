import { useState, useEffect } from 'react';
import { useSemilleros, Semillero } from '../../../hooks/trazabilidad/semillero/useSemilleros';
import VentanaModal from '../../globales/VentanasModales';
import Tabla from '../../globales/Tabla';
import CrearSemillero from '../semillero/CrearSemillero';
import ActualizarSemillero from '../semillero/ActualizarSemillero';
import { addToast } from '@heroui/react';

interface ToastOptions {
  title: string;
  description?: string;
  timeout?: number;
  hideIcon?: boolean;
  variant?: 'success' | 'error' | 'info';
}

const getClasses = (variant: ToastOptions['variant']) => {
  switch (variant) {
    case 'error':
      return {
        textColor: 'text-white',
        bgColor: 'bg-red-500',
      };
    case 'info':
      return {
        textColor: 'text-white',
        bgColor: 'bg-sky-500',
      };
    case 'success':
    default:
      return {
        textColor: 'text-white',
        bgColor: 'bg-green-600',
      };
  }
};

const showToast = ({
  title,
  description,
  timeout = 4000,
  variant = 'success',
}: ToastOptions) => {
  const styles = getClasses(variant);

  addToast({
    title: (
      <div className={`flex items-center font-bold text-md ${styles.textColor}`}>
        <span>{title}</span>
      </div>
    ),
    description: description ? (
      <div className="text-gray-200 text-md mt-1">{description}</div>
    ) : undefined,
    timeout,
    classNames: {
      base: `${styles.bgColor} text-white rounded-3xl`,
      title: 'text-white',
      description: 'text-gray-200',
    },
  });
};

const DetalleSemilleroModal = ({ item }: { item: Semillero }) => {
  // Helper function to safely format dates
  const formatDate = (dateString?: string): string => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleDateString('es-ES') : 'Fecha inválida';
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Detalles del Semillero</h2>
      <div className="space-y-3">
        <p>
          <span className="font-semibold">Nombre:</span>{' '}
          {item.nombre_semilla || 'Sin nombre'}
        </p>
        <p>
          <span className="font-semibold">Fecha de Siembra:</span>{' '}
          {formatDate(item.fecha_siembra)}
        </p>
        <p>
          <span className="font-semibold">Fecha Estimada:</span>{' '}
          {formatDate(item.fecha_estimada)}
        </p>
        <p>
          <span className="font-semibold">Cantidad:</span>{' '}
          {item.cantidad || 'No especificada'}
        </p>
      </div>
    </div>
  );
};

const ListarSemillero = () => {
  const { data: semilleros, error, isLoading, refetch: refetchSemilleros } =
    useSemilleros();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedSemillero, setSelectedSemillero] = useState<Semillero | null>(
    null
  );
  const [modalContenido, setModalContenido] = useState<React.ReactNode>(null);

  // Mostrar toast solo una vez cuando no hay semilleros
  useEffect(() => {
    if (!isLoading && semilleros?.length === 0) {
      showToast({
        title: '❌ No hay semilleros registrados',
        description: 'Haz clic en "Crear Semillero" para agregar uno.',
        variant: 'error',
        timeout: 4000,
      });
    }
  }, [isLoading, semilleros]);

  const handleItemClick = (item: Semillero) => {
    setSelectedSemillero(item);
    setIsDetailModalOpen(true);
  };

  const handleCreate = () => {
    setModalContenido(
      <CrearSemillero
        onSuccess={() => {
          refetchSemilleros();
          closeModal();
        }}
      />
    );
    setIsModalOpen(true);
  };

  const handleUpdate = (row: any) => {
    const semillero = semilleros?.find((s) => s.id === row.id);
    if (semillero) {
      setModalContenido(
        <ActualizarSemillero
          id={semillero.id}
          onSuccess={() => {
            refetchSemilleros();
            closeModal();
          }}
          onCancel={closeModal}
        />
      );
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setSelectedSemillero(null);
    setModalContenido(null);
    setIsModalOpen(false);
    setIsDetailModalOpen(false);
  };

  const tablaData = (semilleros ?? []).map((semillero) => ({
    id: semillero.id,
    nombre_semilla: semillero.nombre_semilla || 'Sin nombre',
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
    cantidad: semillero.cantidad ?? 0,
  }));

  const headers = [
    'Nombre Semilla',
    'Fecha Siembra',
    'Fecha Estimada',
    'Cantidad',
  ];

  if (error) {
    showToast({
      title: '❌ Error al cargar semilleros',
      description: error.message || 'No se pudo cargar la lista de semilleros',
      variant: 'error',
      timeout: 4000,
    });
    return (
      <div className="text-center text-red-500">
        Error al cargar semilleros
      </div>
    );
  }

  return (
    <div className="p-4">
      <VentanaModal
        isOpen={isModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={modalContenido}
      />
      <VentanaModal
        isOpen={isDetailModalOpen}
        onClose={closeModal}
        titulo=""
        contenido={<DetalleSemilleroModal item={selectedSemillero!} />}
      />
      <Tabla
        title="Lista de Semilleros"
        headers={headers}
        data={tablaData.length > 0 ? tablaData : []}
        onClickAction={handleItemClick}
        onUpdate={handleUpdate}
        onCreate={handleCreate}
        createButtonTitle="Crear Semillero"
      />
    </div>
  );
};

export default ListarSemillero;