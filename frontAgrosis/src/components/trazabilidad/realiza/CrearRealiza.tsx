import { useState, useMemo } from 'react';
import { useCrearRealiza, CrearRealizaDTO } from '@/hooks/trazabilidad/realiza/useCrearRealiza';
import { usePlantacion, Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { useActividad, Actividad } from '@/hooks/trazabilidad/actividad/useActividad';
import VentanaModal from '../../globales/VentanasModales';
import CrearPlantacion from '../plantacion/CrearPlantacion';
import CrearActividad from '../actividad/CrearActividad';
import { showToast } from '@/components/globales/Toast';

interface CrearRealizaProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearRealiza = ({ onSuccess, onCancel }: CrearRealizaProps) => {
  const mutation = useCrearRealiza();
  const { data: plantaciones = [], isLoading: isLoadingPlantaciones, error: errorPlantaciones, refetch: refetchPlantaciones } = usePlantacion();
  const { data: actividades = [], isLoading: isLoadingActividades, error: errorActividades, refetch: refetchActividades } = useActividad();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [formData, setFormData] = useState({ fk_id_plantacion: '', fk_id_actividad: '' });

  const plantacionOptions = useMemo(() => {
    return plantaciones.map((plantacion: Plantacion) => ({
      value: plantacion.id.toString(),
      label: `${plantacion.fk_id_cultivo?.fk_id_especie?.nombre_comun || 'Sin especie'} - ${plantacion.fk_id_cultivo?.nombre_cultivo || 'Sin nombre'}`,
    }));
  }, [plantaciones]);

  const actividadOptions = useMemo(() => {
    return actividades.map((actividad: Actividad) => ({
      value: actividad.id.toString(),
      label: actividad.nombre_actividad || 'Sin nombre',
    }));
  }, [actividades]);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const { fk_id_plantacion, fk_id_actividad } = formData;

    if (!fk_id_plantacion || !fk_id_actividad) {
      showToast({
        title: 'Error al crear realiza',
        description: 'Ambos campos son obligatorios',
        timeout: 5000,
        variant: 'error',
      });
      return;
    }

    const nuevoRealiza: CrearRealizaDTO = {
      fk_id_plantacion: parseInt(fk_id_plantacion, 10),
      fk_id_actividad: parseInt(fk_id_actividad, 10),
    };

    mutation.mutate(nuevoRealiza, {
      onSuccess: () => {
        showToast({
          title: 'Realiza creado exitosamente',
          description: 'El realiza ha sido registrado en el sistema',
          timeout: 4000,
          variant: 'success',
        });
        setFormData({ fk_id_plantacion: '', fk_id_actividad: '' });
        onSuccess();
      },
      onError: (error: any) => {
        showToast({
          title: 'Error al crear realiza',
          description: error.message || 'Error desconocido al crear el realiza',
          timeout: 5000,
          variant: 'error',
        });
      },
    });
  };

  const openCreatePlantacionModal = () => {
    setModalContent(
      <CrearPlantacion
        onSuccess={async () => {
          await refetchPlantaciones();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  const openCreateActividadModal = () => {
    setModalContent(
      <CrearActividad
        onSuccess={async () => {
          await refetchActividades();
          setIsModalOpen(false);
        }}
        onCancel={() => setIsModalOpen(false)}
      />
    );
    setIsModalOpen(true);
  };

  if (errorPlantaciones || errorActividades) {
    showToast({
      title: 'Error al cargar datos',
      description: 'Error al cargar plantaciones o actividades',
      timeout: 5000,
      variant: 'error',
    });
    return <div className="text-center text-red-500">Error al cargar plantaciones o actividades</div>;
  }

  if (isLoadingPlantaciones || isLoadingActividades) {
    return <div className="text-center text-gray-500">Cargando plantaciones y actividades...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_plantacion" className="block text-sm font-medium text-gray-700">
              Plantación
            </label>
            <select
              id="fk_id_plantacion"
              name="fk_id_plantacion"
              value={formData.fk_id_plantacion}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione una plantación</option>
              {plantacionOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreatePlantacionModal}
            className="mt-6 bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-900 border border-green-800"
            title="Crear nueva plantación"
          >
            +
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_actividad" className="block text-sm font-medium text-gray-700">
              Actividad
            </label>
            <select
              id="fk_id_actividad"
              name="fk_id_actividad"
              value={formData.fk_id_actividad}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione una actividad</option>
              {actividadOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateActividadModal}
            className="mt-6 bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-900 border border-green-800"
            title="Crear nueva actividad"
          >
            +
          </button>
        </div>
        <div className="flex justify-center">
          <button
            type="submit"
            className="bg-white text-[#2e7d32] px-4 py-2 rounded-md border border-[#2e7d32] hover:bg-[#2e7d32] hover:text-white"
          >
            Registrar
          </button>
        </div>
      </form>
      {isModalOpen && modalContent && (
        <VentanaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo="" contenido={modalContent} />
      )}
    </div>
  );
};

export default CrearRealiza;