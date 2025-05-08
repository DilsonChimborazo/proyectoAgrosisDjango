import { useState, useMemo } from 'react';
import { useCrearRealiza, CrearRealizaDTO } from '@/hooks/trazabilidad/realiza/useCrearRealiza';
import { useCultivo, Cultivos } from '@/hooks/trazabilidad/cultivo/useCultivo';
import { useActividad, Actividad } from '@/hooks/trazabilidad/actividad/useActividad';
import VentanaModal from '../../globales/VentanasModales';
import CrearCultivo from '../cultivos/CrearCultivos';
import CrearActividad from '../actividad/CrearActividad';

interface CrearRealizaProps {
  onSuccess: () => void;
}

const CrearRealiza = ({ onSuccess }: CrearRealizaProps) => {
  const mutation = useCrearRealiza();
  const { data: cultivos = [], isLoading: isLoadingCultivos, error: errorCultivos } = useCultivo();
  const { data: actividades = [], isLoading: isLoadingActividades, error: errorActividades } = useActividad();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [formData, setFormData] = useState({ fk_id_cultivo: '', fk_id_actividad: '' });

  const cultivoOptions = useMemo(() => {
    return cultivos.map((cultivo: Cultivos) => ({
      value: cultivo.id.toString(),
      label: `${cultivo.fk_id_especie?.nombre_comun || 'Sin especie'} - ${cultivo.nombre_cultivo || 'Sin nombre'}`,
    }));
  }, [cultivos]);

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

    const { fk_id_cultivo, fk_id_actividad } = formData;

    if (!fk_id_cultivo || !fk_id_actividad) {
      setErrorMessage('❌ Ambos campos son obligatorios');
      return;
    }

    if (fk_id_cultivo === '' || fk_id_actividad === '') {
      setErrorMessage('❌ Debes seleccionar un cultivo y una actividad válidos');
      return;
    }

    const nuevoRealiza: CrearRealizaDTO = {
      fk_id_cultivo: parseInt(fk_id_cultivo, 10),
      fk_id_actividad: parseInt(fk_id_actividad, 10),
    };

    mutation.mutate(nuevoRealiza, {
      onSuccess: () => {
        console.log('✅ Realiza creado exitosamente');
        setFormData({ fk_id_cultivo: '', fk_id_actividad: '' });
        onSuccess();
      },
      onError: (error: any) => {
        setErrorMessage(`❌ Error al crear realiza: ${error.message || 'Error desconocido'}`);
      },
    });
  };

  const openCreateCultivoModal = () => {
    setModalContent(<CrearCultivo onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  const openCreateActividadModal = () => {
    setModalContent(<CrearActividad onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  if (errorCultivos || errorActividades) {
    return <div className="text-center text-red-500">Error al cargar cultivos o actividades</div>;
  }

  if (isLoadingCultivos || isLoadingActividades) {
    return <div className="text-center text-gray-500">Cargando cultivos y actividades...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_cultivo" className="block text-sm font-medium text-gray-700">
              Cultivo
            </label>
            <select
              id="fk_id_cultivo"
              name="fk_id_cultivo"
              value={formData.fk_id_cultivo}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            >
              <option value="">Seleccione un cultivo</option>
              {cultivoOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateCultivoModal}
            className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
            title="Crear nuevo cultivo"
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
            className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
            title="Crear nueva actividad"
          >
            +
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onSuccess}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
          >
            Crear
          </button>
        </div>
      </form>
      <VentanaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo="" contenido={modalContent} />
    </div>
  );
};

export default CrearRealiza;