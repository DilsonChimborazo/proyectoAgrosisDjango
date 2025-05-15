import { useState, useEffect } from 'react';
import { useCrearProgramacion } from '@/hooks/trazabilidad/programacion/useCrearProgramacion';
import { useActualizarAsignacion } from '@/hooks/trazabilidad/asignacion/useActualizarAsignacion';
import { useMedidas } from '@/hooks/inventario/unidadMedida/useMedidad';
import CrearUnidadMedidaModal from '../../inventario/unidadMedida/UnidadMedida';

interface Programacion {
  id?: number;
  fk_id_asignacionActividades: number;
  fecha_realizada?: string;
  duracion?: string;
  cantidad_insumo?: string;
  fk_unidad_medida?: string;
  img?: File | null | string;
  estado: 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada';
}

interface CrearProgramacionModalProps {
  asignacionId: number;
  existingProgramacion?: Programacion;
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearProgramacionModal = ({ asignacionId, existingProgramacion, onSuccess, onCancel }: CrearProgramacionModalProps) => {
  const { mutate: createProgramacion, isLoading: isLoadingProgramacion, error: mutationErrorProgramacion } = useCrearProgramacion();
  const { mutate: actualizarAsignacion, isLoading: isLoadingAsignacion, error: mutationErrorAsignacion } = useActualizarAsignacion();
  const { data: unidadesMedida, isLoading: isLoadingUnidades, error: errorUnidades } = useMedidas();
  const [formData, setFormData] = useState<Programacion>({
    estado: 'Completada' as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
    fecha_realizada: '',
    duracion: '',
    cantidad_insumo: '',
    fk_unidad_medida: '',
    img: null,
    fk_id_asignacionActividades: asignacionId,
  });
  const [error, setError] = useState<string | null>(null);
  const [isUnidadModalOpen, setIsUnidadModalOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Prefill form data if existingProgramacion is provided
  useEffect(() => {
    if (existingProgramacion) {
      setFormData({
        ...existingProgramacion,
        fk_id_asignacionActividades: asignacionId,
        img: existingProgramacion.img || null,
      });
    } else {
      setFormData((prev) => ({ ...prev, fk_id_asignacionActividades: asignacionId }));
    }
  }, [existingProgramacion, asignacionId]);

  // Generar vista previa de la imagen seleccionada
  useEffect(() => {
    if (formData.img instanceof File) {
      const url = URL.createObjectURL(formData.img);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Liberar la URL al cambiar la imagen o desmontar
    }
    setPreviewUrl(null);
  }, [formData.img]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'img' && files) {
      setFormData((prev) => ({ ...prev, img: files[0] }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setError(null);
  };

  const validateForm = () => {
    if (!formData.fecha_realizada) return 'Debe ingresar la fecha realizada';
    if (!formData.duracion || Number(formData.duracion) <= 0) return 'Debe ingresar una duración válida';
    if (!formData.cantidad_insumo || Number(formData.cantidad_insumo) <= 0) return 'Debe ingresar una cantidad de insumo válida';
    if (!formData.fk_unidad_medida) return 'Debe seleccionar una unidad de medida';
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    if (typeof asignacionId === 'undefined' || asignacionId === null) {
      console.log('Error: asignacionId es undefined o null:', asignacionId);
      setError('ID de asignación no proporcionado. Asegúrate de que el componente padre pase un ID válido.');
      return;
    }

    const formDataToSend = new FormData();
    formDataToSend.append('estado', formData.estado);
    formDataToSend.append('fecha_realizada', formData.fecha_realizada);
    formDataToSend.append('duracion', formData.duracion);
    formDataToSend.append('fk_id_asignacionActividades', asignacionId.toString());
    formDataToSend.append('cantidad_insumo', formData.cantidad_insumo);
    formDataToSend.append('fk_unidad_medida', formData.fk_unidad_medida);
    if (formData.img instanceof File) {
      formDataToSend.append('img', formData.img);
    }

    try {
      await createProgramacion(formDataToSend, {
        onSuccess: async () => {
          await actualizarAsignacion(
            {
              id: asignacionId,
              estado: 'Completada',
            },
            {
              onSuccess: () => {
                onSuccess();
              },
              onError: (err: any) => {
                setError(`Error al actualizar la asignación: ${err.message || 'Por favor, intenta de nuevo.'}`);
              },
            }
          );
        },
        onError: (err: any) => {
          setError(`Error al crear la programación: ${err.message || 'Por favor, intenta de nuevo.'}`);
        },
      });
    } catch (err) {
      setError('Error inesperado al crear la programación.');
      console.error('Unexpected error:', err);
    }
  };

  const handleOpenUnidadModal = () => {
    setIsUnidadModalOpen(true);
  };

  const handleCloseUnidadModal = () => {
    setIsUnidadModalOpen(false);
  };

  const handleUnidadSuccess = () => {
    setIsUnidadModalOpen(false);
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registrar Programación (Finalizar Asignación)</h2>
      {(error || mutationErrorProgramacion || mutationErrorAsignacion || errorUnidades) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error || mutationErrorProgramacion?.message || mutationErrorAsignacion?.message || errorUnidades?.message}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="fecha_realizada" className="block text-sm font-medium text-gray-700">
            Fecha Realizada
          </label>
          <input
            type="date"
            id="fecha_realizada"
            name="fecha_realizada"
            value={formData.fecha_realizada}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="duracion" className="block text-sm font-medium text-gray-700">
            Duración (minutos)
          </label>
          <input
            type="number"
            id="duracion"
            name="duracion"
            value={formData.duracion}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="cantidad_insumo" className="block text-sm font-medium text-gray-700">
            Cantidad de Insumo
          </label>
          <input
            type="number"
            id="cantidad_insumo"
            name="cantidad_insumo"
            value={formData.cantidad_insumo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
            min="0"
            step="0.01"
          />
        </div>
        <div>
          <label htmlFor="fk_unidad_medida" className="block text-sm font-medium text-gray-700">
            Unidad de Medida
          </label>
          <div className="flex items-center space-x-2">
            <select
              id="fk_unidad_medida"
              name="fk_unidad_medida"
              value={formData.fk_unidad_medida}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
              disabled={isLoadingUnidades}
            >
              <option value="">Selecciona una unidad</option>
              {unidadesMedida?.map((unidad) => (
                <option key={unidad.id} value={unidad.id.toString()}>
                  {unidad.nombre_medida || 'Unidad sin nombre'}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleOpenUnidadModal}
              className="mt-1 w-10 h-10 bg-green-500 text-white rounded-full flex items-center justify-center hover:bg-green-600"
            >
              +
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="img" className="block text-sm font-medium text-gray-700">
            Imagen (opcional)
          </label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            accept="image/*"
          />
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Vista previa"
              className="mt-2 w-32 h-32 object-cover rounded"
            />
          )}
        </div>
        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
            disabled={isLoadingProgramacion || isLoadingAsignacion}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-green-700 text-white rounded-md hover:bg-green-900"
            disabled={isLoadingProgramacion || isLoadingAsignacion}
          >
            {isLoadingProgramacion || isLoadingAsignacion ? 'Guardando...' : 'Finalizar Asignación'}
          </button>
        </div>
      </form>

      {isUnidadModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-md">
            <CrearUnidadMedidaModal onSuccess={handleUnidadSuccess} onCancel={handleCloseUnidadModal} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CrearProgramacionModal;