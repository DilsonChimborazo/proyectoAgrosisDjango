import { useState } from 'react';
import { useCrearProgramacion } from '@/hooks/trazabilidad/programacion/useCrearProgramacion'; // Importar desde el archivo correcto
import { useActualizarAsignacion } from '@/hooks/trazabilidad/asignacion/useActualizarAsignacion';

interface CrearProgramacionModalProps {
  asignacionId: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const CrearProgramacionModal = ({ asignacionId, onSuccess, onCancel }: CrearProgramacionModalProps) => {
  const { mutate: createProgramacion, isLoading: isLoadingProgramacion, error: mutationErrorProgramacion } = useCrearProgramacion();
  const { mutate: actualizarAsignacion, isLoading: isLoadingAsignacion, error: mutationErrorAsignacion } = useActualizarAsignacion();
  const [formData, setFormData] = useState({
    estado: 'Completada' as 'Pendiente' | 'Completada' | 'Cancelada' | 'Reprogramada',
    fecha_realizada: '',
    duracion: '',
    cantidad_insumo: '',
    fk_unidad_medida: '',
    img: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);

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
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      // 1. Crear la programación
      await createProgramacion({
        estado: formData.estado,
        fecha_realizada: formData.fecha_realizada,
        duracion: Number(formData.duracion),
        fk_id_asignacionActividades: asignacionId,
        cantidad_insumo: Number(formData.cantidad_insumo),
        fk_unidad_medida: Number(formData.fk_unidad_medida),
        img: formData.img || undefined,
      }, {
        onSuccess: async () => {
          // 2. Actualizar el estado de la asignación a "Completada"
          await actualizarAsignacion({
            id: asignacionId,
            estado: 'Completada',
          }, {
            onSuccess: () => {
              onSuccess();
            },
            onError: (err: any) => {
              setError(`Error al actualizar la asignación: ${err.message || 'Por favor, intenta de nuevo.'}`);
            },
          });
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

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Registrar Programación (Finalizar Asignación)</h2>
      {(error || mutationErrorProgramacion || mutationErrorAsignacion) && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded-md">
          {error || mutationErrorProgramacion?.message || mutationErrorAsignacion?.message}
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
          <select
            id="fk_unidad_medida"
            name="fk_unidad_medida"
            value={formData.fk_unidad_medida}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          >
            <option value="">Selecciona una unidad</option>
            <option value="1">Kilogramos</option>
            <option value="2">Litros</option>
            <option value="3">Unidades</option>
            {/* Agrega más opciones según las unidades de medida disponibles en tu backend */}
          </select>
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
    </div>
  );
};

export default CrearProgramacionModal;