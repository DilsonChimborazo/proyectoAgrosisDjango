import { useState, useMemo } from 'react';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import { useTipoCultivo, TipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import VentanaModal from '../../globales/VentanasModales';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';

interface CrearEspecieProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const CrearEspecie = ({ onSuccess, onCancel }: CrearEspecieProps) => {
  const mutation = useCrearEspecie();
  const { data: tiposCultivo = [], isLoading: isLoadingTiposCultivo, error: errorTiposCultivo } = useTipoCultivo();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);
  const [formData, setFormData] = useState({
    nombre_comun: '',
    nombre_cientifico: '',
    descripcion: '',
    fk_id_tipo_cultivo: '',
  });

  const tipoCultivoOptions = useMemo(() => {
    return tiposCultivo.map((tipo: TipoCultivo) => ({
      value: tipo.id.toString(),
      label: tipo.nombre || 'Sin nombre',
    }));
  }, [tiposCultivo]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);

    const { nombre_comun, nombre_cientifico, fk_id_tipo_cultivo } = formData;

    if (!nombre_comun || !nombre_cientifico || !fk_id_tipo_cultivo) {
      setErrorMessage('❌ Todos los campos son obligatorios');
      return;
    }

    const nuevaEspecie = {
      nombre_comun: nombre_comun.trim(),
      nombre_cientifico: nombre_cientifico.trim(),
      descripcion: formData.descripcion.trim() || '',
      fk_id_tipo_cultivo: parseInt(fk_id_tipo_cultivo, 10),
    };

    mutation.mutate(nuevaEspecie, {
      onSuccess: () => {
        console.log('✅ Especie creada exitosamente');
        setSuccessMessage('✅ Especie registrada con éxito');
        setTimeout(() => setSuccessMessage(null), 3000);
        setFormData({ nombre_comun: '', nombre_cientifico: '', descripcion: '', fk_id_tipo_cultivo: '' });

        if (typeof onSuccess === 'function') {
          onSuccess();
        }
        if (typeof onCancel === 'function') {
          onCancel();
        }
      },
      onError: (error: any) => {
        setErrorMessage(`❌ Error al crear especie: ${error.message || 'Error desconocido'}`);
      },
    });
  };

  const openCreateTipoCultivoModal = () => {
    setModalContent(<CrearTipoCultivo onSuccess={() => setIsModalOpen(false)} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  if (errorTiposCultivo) {
    return <div className="text-center text-red-500">Error al cargar tipos de cultivo</div>;
  }

  if (isLoadingTiposCultivo) {
    return <div className="text-center text-gray-500">Cargando tipos de cultivo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {errorMessage && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">{errorMessage}</div>}
      {successMessage && <div className="mb-4 p-3 bg-green-100 text-green-700 rounded">{successMessage}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombre_comun" className="block text-sm font-medium text-gray-700">
            Nombre Común
          </label>
          <input
            type="text"
            id="nombre_comun"
            name="nombre_comun"
            value={formData.nombre_comun}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="nombre_cientifico" className="block text-sm font-medium text-gray-700">
            Nombre Científico
          </label>
          <input
            type="text"
            id="nombre_cientifico"
            name="nombre_cientifico"
            value={formData.nombre_cientifico}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>
        <div>
          <label htmlFor="fk_id_tipo_cultivo" className="block text-sm font-medium text-gray-700">
            Tipo de Cultivo
          </label>
          <select
            id="fk_id_tipo_cultivo"
            name="fk_id_tipo_cultivo"
            value={formData.fk_id_tipo_cultivo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          >
            <option value="">Seleccione un tipo de cultivo</option>
            {tipoCultivoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
            Cancelar
          </button>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700">
            {mutation.isPending ? 'Creando...' : 'Registrar'}
          </button>
        </div>
      </form>
      <VentanaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo="" contenido={modalContent} />
    </div>
  );
};

export default CrearEspecie;