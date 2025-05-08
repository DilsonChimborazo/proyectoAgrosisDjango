
import { useState, FormEvent, useEffect } from 'react';
import { useCrearEspecie } from '@/hooks/trazabilidad/especie/useCrearEspecie';
import { useTipoCultivo } from '@/hooks/trazabilidad/tipoCultivo/useTipoCultivo';
import VentanaModal from '../../globales/VentanasModales';
import CrearTipoCultivo from '../tipocultivo/CrearTipoCultivo';


interface CrearEspecieProps {
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearEspecie = ({ onSuccess, onCancel }: CrearEspecieProps) => {
  const [nombreComun, setNombreComun] = useState('');
  const [nombreCientifico, setNombreCientifico] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [fk_id_tipo_cultivo, setFk_id_tipo_cultivo] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { mutate: createEspecie, isPending, error: mutationError } = useCrearEspecie();
  const { data: tiposCultivo = [], refetch: refetchTiposCultivo, isLoading: isLoadingTiposCultivo } = useTipoCultivo();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    refetchTiposCultivo();
  }, [refetchTiposCultivo]);


  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!nombreComun) {
      setErrorMessage('El nombre común es obligatorio.');
      return;
    }
    if (!nombreCientifico) {
      setErrorMessage('El nombre científico es obligatorio.');
      return;
    }
    if (!fk_id_tipo_cultivo) {
      setErrorMessage('Debe seleccionar un tipo de cultivo.');
      return;
    }

    const tipoCultivoExists = tiposCultivo.some((tipo) => tipo.id === parseInt(fk_id_tipo_cultivo, 10));
    if (!tipoCultivoExists) {
      setErrorMessage('El tipo de cultivo seleccionado no es válido.');
      return;
    }

    const nuevaEspecie = {
      nombre_comun: nombreComun,
      nombre_cientifico: nombreCientifico,
      descripcion: descripcion || '',
      fk_id_tipo_cultivo: parseInt(fk_id_tipo_cultivo, 10),
    };

    createEspecie(nuevaEspecie, {
      onSuccess: () => {
        console.log("✅ Callback onSuccess ejecutado en CrearEspecie");
        setNombreComun('');
        setNombreCientifico('');
        setDescripcion('');
        setFk_id_tipo_cultivo('');
        onSuccess();
      },
      onError: (err: any) => {
        const errorDetail = err.response?.data?.detail || err.message || 'Error desconocido';
        setErrorMessage(`Error al crear la especie: ${errorDetail}`);
      },
    });
  };

  const openCreateTipoCultivoModal = () => {
    setModalContent(<CrearTipoCultivo onSuccess={() => { setIsModalOpen(false); refetchTiposCultivo(); }} onCancel={() => setIsModalOpen(false)} />);
    setIsModalOpen(true);
  };

  if (isLoadingTiposCultivo) {
    return <div className="text-center text-gray-500">Cargando tipos de cultivo...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Crear Nueva Especie</h2>
      {(errorMessage || mutationError) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {errorMessage || mutationError?.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="nombreComun" className="block text-sm font-medium text-gray-700">
            Nombre Común
          </label>
          <input
            type="text"
            id="nombreComun"
            value={nombreComun}
            onChange={(e) => setNombreComun(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="nombreCientifico" className="block text-sm font-medium text-gray-700">
            Nombre Científico
          </label>
          <input
            type="text"
            id="nombreCientifico"
            value={nombreCientifico}
            onChange={(e) => setNombreCientifico(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
            disabled={isPending}
          />
        </div>
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            id="descripcion"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            disabled={isPending}
          />
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <label htmlFor="fk_id_tipo_cultivo" className="block text-sm font-medium text-gray-700">
              Tipo de Cultivo
            </label>
            <select
              id="fk_id_tipo_cultivo"
              value={fk_id_tipo_cultivo}
              onChange={(e) => setFk_id_tipo_cultivo(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
              disabled={isPending}
            >
              <option value="">Seleccione un tipo de cultivo</option>
              {tiposCultivo.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.nombre}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={openCreateTipoCultivoModal}
            className="mt-6 bg-green-700 text-white px-3 py-1 rounded hover:bg-green-900"
            title="Crear nuevo tipo de cultivo"
            disabled={isPending}
          >
            +
          </button>
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isPending}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
            disabled={isPending}
          >
            {isPending ? 'Creando...' : 'Crear'}
          </button>
        </div>
      </form>
      <VentanaModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} titulo="" contenido={modalContent} />
    </div>
  );
};

export default CrearEspecie;