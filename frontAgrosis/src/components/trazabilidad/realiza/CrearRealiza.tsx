import { useState, useMemo } from 'react';
import { useCrearRealiza, CrearRealizaDTO } from '@/hooks/trazabilidad/realiza/useCrearRealiza';
import { usePlantacion, Plantacion } from '@/hooks/trazabilidad/plantacion/usePlantacion';
import { useActividad, Actividad } from '@/hooks/trazabilidad/actividad/useActividad';
import VentanaModal from '../../globales/VentanasModales';
import CrearPlantacion from '../plantacion/CrearPlantacion';
import CrearActividad from '../actividad/CrearActividad';

interface CrearRealizaProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearRealiza = ({ onSuccess, onCancel }: CrearRealizaProps) => {
  const mutation = useCrearRealiza();
  const { data: plantaciones = [], isLoading: isLoadingPlantaciones, error: errorPlantaciones } = usePlantacion();
  const { data: actividades = [], isLoading: isLoadingActividades, error: errorActividades } = useActividad();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);

    const { fk_id_plantacion, fk_id_actividad } = formData;

    if (!fk_id_plantacion || !fk_id_actividad) {
      setErrorMessage('❌ Ambos campos son obligatorios');
      return;
    }

    const nuevoRealiza: CrearRealizaDTO = {
      fk_id_plantacion: parseInt(fk_id_plantacion, 10),
      fk_id_actividad: parseInt(fk_id_actividad, 10),
    };

    mutation.mutate(nuevoRealiza, {
      onSuccess: () => {
        console.log('✅ Realiza creado exitosamente');
        setFormData({ fk_id_plantacion: '', fk_id_actividad: '' });
        onSuccess();
      },
      onError: (error: any) => {
        setErrorMessage(`❌ Error al crear realiza: ${error.message || 'Error desconocido'}`);
      },
    });
  };

  const openCreatePlantacionModal = () => {
    setModalContent(<CrearPlantacion onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  const openCreateActividadModal = () => {
    setModalContent(<CrearActividad onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  if (errorPlantaciones || errorActividades) {
    return <div className="text-center text-red-500">Error al cargar plantaciones o actividades</div>;
  }

  if (isLoadingPlantaciones || isLoadingActividades) {
    return <div className="text-center text-gray-500">Cargando plantaciones y actividades...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
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
            className="mt-6 bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-900"
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
            className="mt-6 bg-green-700 text-white rounded-full w-10 h-10 flex items-center justify-center hover:bg-green-900"
            title="Crear nueva actividad"
          >
            +
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            Crear
          </button>
        </div>
      </form>
      <VentanaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo="" contenido={modalContent} />
    </div>
  );
};

export default CrearRealiza;